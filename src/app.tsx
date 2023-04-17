import React, { useState, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@mui/material";
import { Home, Projects, About, Registration, Login } from "./routes";
import customTheme1 from "./themes/custom1";

// Apis
import { TProject } from "./api/getProjects";
import { getProjectsSearch } from "./api/getSearchProjects";

// Other
import { searchFilterParams, TAvailParameters, fetchCurrentParameters } from "./components/search/AvailableParams";
import Navbar from "./components/Navbar";
import { AuthProvider } from './customHooks/useAuth';

// Represents curr state of filters
export type TFiltersState = {
  keywords: string,
  category: TAvailParameters['category'][0],
  semester: TAvailParameters['semester'][0],
  award: TAvailParameters['award'][0],
  sortBy: TAvailParameters['sortBy'][0],
  // These two are for pagination
  currPage: number,
  projectsPerPage: number,
}


export default function App() {
  
  const [projects, setProjects] = useState<TProject[]>([]);
  const [totalNumProjects, setTotalNumProjects] = useState(0)
  const [searchFilters, setSearchFilters] = useState<TFiltersState>({
    keywords: '',
    category: searchFilterParams.category[0],
    semester: searchFilterParams.semester[0],
    award: searchFilterParams.award[0],
    sortBy: searchFilterParams.sortBy[0],
    currPage: 1,
    projectsPerPage: 6
  })
  // Fetch required number of projects based on given parameters
  useEffect(() => {
    const fetchProjects = async () => {
      const respData = await getProjectsSearch({ ...searchFilters });
      setTotalNumProjects(respData.searchTotal)
      setProjects(respData.projects);
    };
    fetchProjects();
  }, [searchFilters]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={customTheme1}>
          <Navbar
            currFilters={searchFilters}
            setFilters={setSearchFilters}
          />
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/projects/*" element={
              <Projects
                currFilters={searchFilters}
                setFilters={setSearchFilters}
                {...{totalNumProjects, projects}}
              />}
            />
            <Route path="/About" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Registration />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}