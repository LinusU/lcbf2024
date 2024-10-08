import React, { useMemo, useState } from 'react'
import sortOn from 'sort-on'
import Fuse from 'fuse.js'
import { HStack, Text, VStack } from 'react-stacked'

import { BeerStyle, Beer as BeerType } from '../data'
import { useCheckedIn, useLocationFilter, useSavedForLater, useSearchTerm, useSessionFilter, useSortCriteria, useSortOrder, useStyleFilter } from '../lib/storage'

import Popup from '../react-animated-popup'
import Beer from './Beer'
import RadioButton from './RadioButton'
import CheckBox from './CheckBox'
import Button from './Button'
import CollapsableSection from './CollapsableSection'
import Input from './Input'
import { FaGithub, FaQuestionCircle } from 'react-icons/fa'
import { theme } from '../lib/theme'
import { Location, getBreweryLocation, locations } from '../lib/location'

export type SortCriteria = 'abv' | 'rating' | 'ratingCount' | 'nameLength' | 'noSpaceNameLength'
interface BeerListProps {
  beers: BeerType[]
}

const allBeerStyles: BeerStyle[] = ['barrel', 'belgian', 'bitter', 'cask', 'cider', 'dark', 'farmhouse', 'fruited', 'ipa', 'lager', 'other', 'pale', 'pastry', 'sour', 'strong', 'wheat']

const BeerList: React.FC<BeerListProps> = ({ beers }) => {
  const [sortOrder, setSortOrder] = useSortOrder()
  const [sortCriteria, setSortCriteria] = useSortCriteria()
  const sessionFilter = useSessionFilter()
  const locationFilter = useLocationFilter()
  const styleFilter = useStyleFilter()
  const [searchTerm, setSearchTerm] = useSearchTerm()
  const [showHelp, setShowHelp] = useState(false)
  const [filterFavorites, setFilterFavorites] = useState(false)
  const savedForLater = useSavedForLater()
  const [filterDrunk, setFilterDrunk] = useState(false)
  const [hideDrunk, setHideDrunk] = useState(false)
  const checkedInBeers = useCheckedIn()
  const [lastCall, setLastCall] = useState(false)
  const [locationPopup, setLocationPopup] = useState<Location | null>(null)

  const activeLocationFilter = useMemo(() => {
    const vaults = locations.vaults.filter(location => locationFilter.has(location.name))
    const quayside = locations.quayside.filter(location => locationFilter.has(location.name))

    return {
      vaults,
      quayside
    }
  }, [locationFilter])

  const handleResetFilter = () => {
    setSortOrder('desc')
    setSortCriteria('rating')
    sessionFilter.clear()
    styleFilter.clear()
    locationFilter.clear()
    setSearchTerm('')
  }

  const handleShowLocation = (location: Location) => {
    setLocationPopup(location)
  }

  const filteredBeers = useMemo(() => {
    // Filter beer
    return beers.filter(beer => {
      if (filterFavorites && !savedForLater.has(beer.untappd ?? '')) return false
      if (filterDrunk && !checkedInBeers.has(beer.untappd ?? '')) return false
      if (hideDrunk && checkedInBeers.has(beer.untappd ?? '')) return false
      if (locationFilter.size > 0 && !locationFilter.has(getBreweryLocation(beer.brewery)?.name ?? '')) return false

      const noSessionsSelected = sessionFilter.size == 0

      if (!noSessionsSelected && lastCall) {
        if (sessionFilter.has('friAm') && (beer.fri_pm || beer.sat_am || beer.sat_pm)) return false
        if (sessionFilter.has('friPm') && (beer.sat_am || beer.sat_pm)) return false
        if (sessionFilter.has('satAm') && beer.sat_pm) return false
      }

      // If no sessions and no styles are selected, include all beers
      if (noSessionsSelected && styleFilter.size === 0) return true

      // Session filter
      const sessionMatch = (sessionFilter.has('friAm') && beer.fri_am) || (sessionFilter.has('friPm') && beer.fri_pm) || (sessionFilter.has('satAm') && beer.sat_am) || (sessionFilter.has('satPm') && beer.sat_pm)

      // If no styles are selected, return the session match result
      if (styleFilter.size === 0) return sessionMatch

      // Beer style filter
      const styleMatch = beer.styles.some(style => styleFilter.has(style))

      return (noSessionsSelected || sessionMatch) && styleMatch
    })
  }, [beers, checkedInBeers, filterDrunk, filterFavorites, hideDrunk, lastCall, locationFilter, savedForLater, sessionFilter, styleFilter])

  const fuse = useMemo(() => {
    return new Fuse(filteredBeers, {
      keys: ['name', 'brewery'],
      threshold: 0.2
    })
  }, [filteredBeers])

  const searchedBeers = useMemo(() => {
    if (searchTerm === '') return filteredBeers

    return fuse.search(searchTerm).map(result => result.item)
  }, [filteredBeers, fuse, searchTerm])

  const sortedBeers = useMemo(() => {
    const sortOrderPrefix = sortOrder === 'asc' ? '' : '-'
    const sortOrderMultiplier = sortOrder === 'asc' ? 1 : -1

    switch (sortCriteria) {
      case 'abv':
      case 'rating':
      case 'ratingCount':
        return sortOn(searchedBeers, [
          (beer: BeerType) => (sortCriteria === 'rating' && beer.rating == null)
            || (sortCriteria === 'ratingCount' && beer.ratingCount == null) ? 1 : 0,
          sortOrderPrefix.concat(sortCriteria)
        ])

      case 'nameLength':
        return sortOn(searchedBeers, (beer: BeerType) => beer.name.length * sortOrderMultiplier)

      case 'noSpaceNameLength':
        return sortOn(searchedBeers, (beer: BeerType) => Math.max(...beer.name.split(' ').map(word => word.length)) * sortOrderMultiplier)

      default:
        return sortOn(searchedBeers, [
          (beer: BeerType) => beer?.['rating'] == null ? 1 : 0,
          sortOrderPrefix.concat('rating')
        ])
    }
  }, [searchedBeers, sortCriteria, sortOrder])

  return (
    <div>
      <Popup visible={showHelp} onClose={() => setShowHelp(false)} style={{ fontFamily: 'sans-serif' }}>
        <VStack gap={10}>
          <p>This web application was created for London Craft Beer Festival 2024 and will help you find the beers and their respective rating</p>
          <p>The bars on the beer cards indicate on what session they are available. The first bar corresponds to friday afternoon etc.</p>
          <p>This application was created by <a href='https://github.com/LinusU'>Linus Unnebäck</a>, <a href='https://github.com/3DJakob'>Jakob Unnebäck</a>, <a href='https://github.com/rSkogeby'>Richard Skogeby</a> and Otto Gärdin</p>
          <Button onClick={() => window.open('https://github.com/LinusU/lcbf2024', '_blank')}><p style={{ marginRight: 10 }}>View on Github</p> <FaGithub></FaGithub></Button>
        </VStack>
      </Popup>

      <Popup visible={locationPopup != null} onClose={() => setLocationPopup(null)} style={{ padding: '12px' }}>
        {locationPopup?.level === 'quayside' && <>
          <Text align='center' padding={4}>Quayside (first floor)</Text>
          <img src='https://locousercontent.com/4LE6AgLJmdJJPZs1oTYOq5G1_kYbkse_9A4Ip3C2s-SG-Xv90l8MFinTbU4HFjk8/original.png' />
        </>}

        {locationPopup?.level === 'vaults' && <>
          <Text align='center' padding={4}>Vaults (ground floor)</Text>
          <img src='https://locousercontent.com/kH3M-T1707Dt97Z62rLdWcTTovVS7lLJU0mntb3AEu8hejlY6wV1ioI9nZhCbZ_Y/original.png' />
        </>}
      </Popup>

      <div style={{ backgroundColor: '#efefef', fontFamily: 'sans-serif', minHeight: '100vh' }}>
        <HStack paddingHorizontal={20} paddingVertical={8} width='100%'>
          <Button onClick={handleResetFilter} outlined>Clear filters</Button>

          <div style={{ display: 'flex', flex: 1 }}></div>

          <div onClick={() => setShowHelp(true)} style={{ padding: '22px 6px' }}>
            <FaQuestionCircle color={theme.primary} size={22} />
          </div>
        </HStack>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <div>

            <p><b>Sort</b></p>

            <CollapsableSection title='Sort Criteria'>
              <RadioButton checked={sortCriteria === 'rating'} onChange={() => setSortCriteria('rating')} title='Untappd rating' />
              <RadioButton checked={sortCriteria === 'abv'} onChange={() => setSortCriteria('abv')} title='Alcohol % by volume (%ABV)' />
              <RadioButton checked={sortCriteria === 'ratingCount'} onChange={() => setSortCriteria('ratingCount')} title='Number of check-ins' />
              <RadioButton checked={sortCriteria === 'nameLength'} onChange={() => setSortCriteria('nameLength')} title='Name length' />
              <RadioButton checked={sortCriteria === 'noSpaceNameLength'} onChange={() => setSortCriteria('noSpaceNameLength')} title='Longest word in name' />
            </CollapsableSection>

            <CollapsableSection title='Sort Order'>
              <HStack>
                <Button compact style={{ marginRight: 6 }} onClick={() => setSortOrder('asc')} outlined={sortOrder !== 'asc'}>Asc</Button>
                <Button compact onClick={() => setSortOrder('desc')} outlined={sortOrder !== 'desc'}>Desc</Button>
              </HStack>
            </CollapsableSection>
          </div>

          <div style={{ height: 12 }} />

          <div>
            <p><b>Filter</b></p>

            <CollapsableSection title='Sessions'>
              <CheckBox checked={sessionFilter.has('friAm')} onChange={() => sessionFilter.has('friAm') ? sessionFilter.delete('friAm') : sessionFilter.add('friAm')} title='Friday Afternoon' />
              <CheckBox checked={sessionFilter.has('friPm')} onChange={() => sessionFilter.has('friPm') ? sessionFilter.delete('friPm') : sessionFilter.add('friPm')} title='Friday Evening' />
              <CheckBox checked={sessionFilter.has('satAm')} onChange={() => sessionFilter.has('satAm') ? sessionFilter.delete('satAm') : sessionFilter.add('satAm')} title='Saturday Afternoon' />
              <CheckBox checked={sessionFilter.has('satPm')} onChange={() => sessionFilter.has('satPm') ? sessionFilter.delete('satPm') : sessionFilter.add('satPm')} title='Saturday Evening' />
            </CollapsableSection>


            <CollapsableSection title='Beer Style'>
              {
                allBeerStyles.map(style => (
                  <CheckBox
                    key={style}
                    checked={styleFilter.has(style)}
                    onChange={() => styleFilter.toggle(style)}
                    title={style.charAt(0).toUpperCase() + style.slice(1)}
                  />
                ))
              }
            </CollapsableSection>

            <CollapsableSection title={`Location ${locationFilter.size > 0 ? `(${activeLocationFilter.vaults.length + activeLocationFilter.quayside.length} of ${locations.vaults.length + locations.quayside.length})` : ''}`}>
              <CollapsableSection title={`Vaults (${activeLocationFilter.vaults.length > 0 ? activeLocationFilter.vaults.length : 'ground floor'})`}>
                {
                  locations.vaults.map(location => (
                    <CheckBox
                      key={location.name}
                      checked={locationFilter.has(location.name)}
                      onChange={() => locationFilter.toggle(location.name)}
                      title={location.name.charAt(0).toUpperCase() + location.name.slice(1)}
                    />
                  ))
                }
              </CollapsableSection>

              <CollapsableSection title={`Quayside (${activeLocationFilter.quayside.length > 0 ? activeLocationFilter.quayside.length : 'first floor'})`}>
                {
                  locations.quayside.map(location => (
                    <CheckBox
                      key={location.name}
                      checked={locationFilter.has(location.name)}
                      onChange={() => locationFilter.toggle(location.name)}
                      title={location.name.charAt(0).toUpperCase() + location.name.slice(1)}
                    />
                  ))
                }
              </CollapsableSection>
            </CollapsableSection>

            <CheckBox checked={filterFavorites} onChange={() => setFilterFavorites(val => !val)} title={'Only show favorites (' + savedForLater.size + ')'} />
            <CheckBox checked={filterDrunk} onChange={() => setFilterDrunk(val => !val)} title={'Only show checked in (' + checkedInBeers.size + ')'} />
            <CheckBox checked={hideDrunk} onChange={() => setHideDrunk(val => !val)} title='Hide checked in' />
            <CheckBox checked={lastCall} onChange={() => setLastCall(val => !val)} title='Only show last call' />
          </div>

          <div style={{ height: 4 }} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {searchTerm === '' ? (
              <div style={{ height: 18 }} />
            ) : (
              <div>
                <p style={{ fontSize: 12, paddingLeft: 12 }}><i>{sortedBeers.length} search results</i></p>

                <div style={{ height: 4 }} />
              </div>
            )}

            <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Search...' />
          </div>
        </div>

        {sortedBeers.map(b => <Beer key={b.id} beer={b} onShowLocation={handleShowLocation} />)}

        {
          sortedBeers.length === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#666'
            }}>
              No results :-/
            </div>
          )
        }
      </div >
    </div >
  )
}

export default BeerList
