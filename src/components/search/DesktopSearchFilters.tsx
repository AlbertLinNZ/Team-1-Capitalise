import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Box, TextField, SelectChangeEvent, Typography } from '../../mui'
import FilterDropdown from './FilterDropdown'
import { searchFilterParams, TAvailParameters } from './AvailableParams'
import { TFiltersState } from '../../app';



// represents props taken by DesktopSearchFilters and MobileSearchFilters
export interface SearchFilterProps {
  currFilters: TFiltersState,
  setFilters: Dispatch<SetStateAction<TFiltersState>>
}


export default function DesktopSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

  const size = 'small';
  const variant = 'outlined';

  const handleChange = (e: SelectChangeEvent) => {
    const name = e.target.name
    const key = name as keyof TAvailParameters
    // find the actual parameter object based on value
    const param = searchFilterParams[key].find(p => p.value === e.target.value)
    setFilters({
      ...currFilters,
      [name]: param
    })
  }

  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilters({
      ...currFilters,
      keywords: e.target.value
    })
  }

  return (
    <Box
      top="8vh"
      position="fixed"
      bgcolor="white"
      width="340px"
      height="92vh"
      padding="30px 40px"
      sx={{
        display: { xs: "none", md: "block" }
      }}
    >
      <Box mt={3}>
        <Typography variant='h5' mb={2} >Refine search</Typography>
        <TextField sx={{ mb: 4 }}
          size={size}
          id="keywords-textfield"
          label="Keywords"
          name='keywords'
          value={currFilters.keywords}
          onChange={handleKeywordsChange}
          fullWidth
          variant={variant}
        />

        <FilterDropdown value={currFilters.category.value} name='category' label='Category' options={searchFilterParams.category} handleChange={handleChange} />
        <FilterDropdown value={currFilters.semester.value} name='semester' label='Semester' options={searchFilterParams.semester} handleChange={handleChange} />
        <FilterDropdown value={currFilters.award.value} name='award' label='Award' options={searchFilterParams.award} handleChange={handleChange} />
        <FilterDropdown value={currFilters.sortBy.value} name='sortBy' label='Sort by' options={searchFilterParams.sortBy} handleChange={handleChange} />
      </Box>
    </Box>
  )
}
