import { Box, Stack } from '@mui/material'
import FilterButton from './FilterButton'
import { SearchFilterProps } from './DesktopSearchFilters'
import SearchBar from '../SearchBar'
import { searchFilterParams } from './AvailableParams'



export default function MobileSearchFilters({ currFilters, setFilters }: SearchFilterProps) {

  return (
    <Stack
      // bgcolor="white"
      padding="20px 20px"
      justifyContent="center"
      alignItems="center"
      flexDirection={"column"}
      gap={2}
      sx={{
        mt: 1,
        display: { xs: "flex", md: "none" },
      }}
    >
      <SearchBar currFilters={currFilters} setFilters={setFilters}/>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          flexWrap: "wrap",
          margin: 0,
          overflow: "auto",
        }}

      >
        <FilterButton  label='Category' name='category' options={searchFilterParams.category} filtersState={{ currFilters, setFilters }} />
        <FilterButton  label='Semester' name='semester' options={searchFilterParams.semester} filtersState={{ currFilters, setFilters }} />
        <FilterButton  label='Award' name='award' options={searchFilterParams.award} filtersState={{ currFilters, setFilters }} />
        <FilterButton  label='Sort by' name='sortBy' options={searchFilterParams.sortBy} filtersState={{ currFilters, setFilters }} />
      </Box>
    </Stack>


  )
}