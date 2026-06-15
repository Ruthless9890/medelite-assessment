import { useState } from 'react'

const IS_DEV = window.location.hostname === 'localhost'
const PROXY = 'https://corsproxy.io/?url='
const CMS_BASE = 'https://data.cms.gov/provider-data/api/1/datastore/query'
const DS_PROVIDER = '4pq5-n9py'
const DS_CLAIMS = 'ijh5-nb2v'
const DS_STATE_AVG = 'xcdc-v8bm'

export function useCMS() {
  const [facility, setFacility] = useState(null)
  const [claims, setClaims] = useState({})
  const [stateAvgs, setStateAvgs] = useState({ state: {}, national: {} })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchFacility(ccn) {
    setLoading(true)
    setError(null)
    setFacility(null)

    try {
      const providerData = await cmsQuery(DS_PROVIDER, [
        { property: 'cms_certification_number_ccn', value: ccn }
      ])

      if (!providerData.results || providerData.results.length === 0) {
        throw new Error(`No facility found for CCN "${ccn}". Please check and try again.`)
      }

      const facilityResult = providerData.results[0]
      setFacility(facilityResult)

      try {
        const claimsData = await cmsQuery(DS_CLAIMS, [
          { property: 'cms_certification_number_ccn', value: ccn }
        ], 50)

        const claimsMap = {}
        claimsData.results?.forEach(r => {
          claimsMap[r.measure_code] = r
        })
        setClaims(claimsMap)
      } catch {
        setClaims({})
      }

      try {
        const state = facilityResult.state
        const [stateRes, natRes] = await Promise.all([
          cmsQuery(DS_STATE_AVG, [{ property: 'state_or_nation', value: state }]),
          cmsQuery(DS_STATE_AVG, [{ property: 'state_or_nation', value: 'NATION' }])
        ])
        setStateAvgs({
          state: stateRes.results?.[0] || {},
          national: natRes.results?.[0] || {}
        })
      } catch {
        setStateAvgs({ state: {}, national: {} })
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { facility, claims, stateAvgs, loading, error, fetchFacility }
}

async function cmsQuery(dataset, conditions, limit = 1) {
  const params = new URLSearchParams({ limit })
  conditions.forEach((c, i) => {
    params.set(`conditions[${i}][property]`, c.property)
    params.set(`conditions[${i}][value]`, c.value)
    params.set(`conditions[${i}][operator]`, c.operator || '=')
  })
  const cmsUrl = `${CMS_BASE}/${dataset}/0?${params}`
  const url = IS_DEV
    ? PROXY + encodeURIComponent(cmsUrl)
    : `/api/cms?url=${encodeURIComponent(cmsUrl)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CMS API error: ${res.status}`)
  return res.json()
}