"use client";
import './App.css';

import Homepage from './components/homepage/Homepage';

import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import {Article} from './components/article/Article';
import ErrorPage from './components/error/ErrorPage';
import ArticlesPage from './components/article/ArticlesPage';
import SearchResult from './components/search/SearchResult';
import PostPage from './components/post_page/PostPage';
import ArticleManagement from './components/article_management/ArticleManagement';
import AuthenticationPage from './components/authentication/authpage';
import ProjectPage from './components/project_page/ProjectPage';
import Dashboard from './components/dashboard/Dashboard';



function App() {
  

  return (
    
      <Router>
      <Routes>
            <Route path='/' element={< Homepage />}></Route>
            <Route path='/articles' element= {<ArticlesPage/>}>
            </Route>
            <Route path='/articles/new' element= {<PostPage/>}></Route>
            <Route path='/articles/edit' element= {<ArticleManagement/>}></Route>
            <Route path='/articles/:id' element= {<Article/>}></Route>
            <Route path='/articles/:id/edit' element= {<PostPage/>}></Route>
            
            <Route path='/authentication' element= {<AuthenticationPage/>}></Route>
            <Route path='/dashboard' element= {<Dashboard/>}></Route>
            <Route path='/projects' element= {<ProjectPage/>}></Route>
            <Route path='/search' element= {<SearchResult/>}></Route>
            <Route path='*' element= {<ErrorPage/>}></Route>
    </Routes>
    </Router>
   
    
  )
}

export default App
