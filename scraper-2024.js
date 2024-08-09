import fs from 'fs'
import get from 'simple-get'
import upstreamSlugify from 'slugify'

function slugify(string) {
  return upstreamSlugify(string, {
    lower: true,
    remove: /[*+~,.()'"!:@/#=?]/g,
  })
}

function fetch (url) {
  return new Promise((resolve, reject) => {
    get.concat({
      url,
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36' }
    }, (err, res, data) => {
      if (err) return reject(err)

      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Server responded with ${res.statusCode}`))
      }

      resolve(String(data))
    })
  })
}

let data
try {
  data = JSON.parse(fs.readFileSync('cache/beers_object.json', 'utf8'))
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }

  throw 'fixme'
}

const parsed = [...Object.values(data)].map((row) => {
  let styles = []
  if (row.lager.toLowerCase() === 'yes') styles.push('lager')
  if (row.pale.toLowerCase() === 'yes') styles.push('pale')
  if (row.ipa.toLowerCase() === 'yes') styles.push('ipa')
  if (row.dark.toLowerCase() === 'yes') styles.push('dark')
  if (row.sour.toLowerCase() === 'yes') styles.push('sour')
  if (row.wheat.toLowerCase() === 'yes') styles.push('wheat')
  if (row.farmhouse.toLowerCase() === 'yes') styles.push('farmhouse')
  if (row.cask.toLowerCase() === 'yes') styles.push('cask')
  if (row.pastry.toLowerCase() === 'yes') styles.push('pastry')
  if (row.belgian.toLowerCase() === 'yes') styles.push('belgian')
  if (row.strong.toLowerCase() === 'yes') styles.push('strong')
  if (row.fruited.toLowerCase() === 'yes') styles.push('fruited')
  if (row.barrel.toLowerCase() === 'yes') styles.push('barrel')
  if (row.cider.toLowerCase() === 'yes') styles.push('cider')
  if (row.other.toLowerCase() === 'yes') styles.push('other')

  return {
    id: String(row.wab_beer_id),
    brewery: row.brewer_name,
    name: row.beer_name,
    untappd: row.ut_bid === '' ? undefined : String(row.ut_bid),
    untappdUrl: row.ut_bid === '' ? undefined : `https://untappd.com/b/${slugify(row.brewer_name)}-${slugify(row.beer_name)}/${row.ut_bid}`,
    untappdAppUrl: row.ut_bid === '' ? undefined : `untappd://beer/${row.ut_bid}`,
    fri_am: row.fri_am.toLowerCase() === 'yes',
    fri_pm: row.fri_pm.toLowerCase() === 'yes',
    sat_am: row.sat_am.toLowerCase() === 'yes',
    sat_pm: row.sat_pm.toLowerCase() === 'yes',
    abv: Number(row.abv.replace('%', '')),
    styles,
    gf: (row.gf.toLowerCase() === 'yes'),
    non_alc: (row.non_alc.toLowerCase() === 'yes'),
    rating: row.untappd_rating === '' ? undefined : Number(row.untappd_rating),
    ratingCount: undefined,
    image: row.image === '' ? undefined : row.image,
  }
})

console.log(`Found ${parsed.length} beers`)

fs.writeFileSync('src/data.ts', `export type BeerStyle = 'lager' | 'pale' | 'ipa' | 'dark' | 'sour' | 'wheat' | 'farmhouse' | 'cask' | 'bitter' | 'pastry' | 'belgian' | 'strong' | 'fruited' | 'barrel' | 'cider' | 'other'

export interface Beer {
  id: string,
  brewery: string,
  name: string,
  untappd?: string,
  untappdAppUrl?: string,
  untappdUrl?: string,
  rating?: number,
  ratingCount?: number,
  image?: string,
  fri_am: boolean,
  fri_pm: boolean,
  sat_am: boolean,
  sat_pm: boolean,
  abv: number,
  styles: BeerStyle[],
  gf: boolean,
  non_alc: boolean,
}

export const allBeers: Beer[] = ${JSON.stringify(parsed, null, 2)}
`)
