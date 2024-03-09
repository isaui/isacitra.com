"use client";
import './App.css';
import Home from './modules/HomepageModule/pages/Homepage';
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import {Article} from './components/article/Article';
import ErrorPage from './components/error/ErrorPage';
import ArticlesPage from './components/article/ArticlesPage';
import SearchResult from './components/search/SearchResult';
import PostPage from './components/post_page/PostPage';
import ArticleManagement from './components/article_management/ArticleManagement';
import AuthenticationPage from './components/authentication/authpage';
import ProjectPage from './components/project_page/ProjectPage';
import Dashboard from './modules/DashboardModule/pages/Dashboard';
import LearnPage from './modules/LearnModule/pages/LearnPage';
import LearnAddPage from './modules/LearnModule/pages/LearnAddPage';
import ContentLearnPage from './modules/LearnModule/pages/ContentLearnPage';
import AddNotePage from './modules/LearnModule/pages/AddNotePage';
import EditNotePage from './modules/LearnModule/pages/EditNotePage';
import QueryScreen from './components/query_screen/QueryScreen';
import VideoConferenceHomeScreen from './modules/VideoConferenceModule/pages/VideoConferenceHomeScreen';
import RoomPage from './modules/VideoConferenceModule/pages/VideoConferenceScreen';
import CalendarPage from './modules/CalendarModule/pages/CalendarPage';

function App() {
  return (
    
      <Router>
      <Routes>
            <Route path='/' element={< Home />}></Route>
            <Route path='/articles' element= {<ArticlesPage/>}>
            </Route>

            <Route path='/articles/new' element= {<PostPage/>}></Route>
            <Route path='/articles/edit' element= {<ArticleManagement/>}></Route>
            <Route path='/articles/:id' element= {<Article/>}></Route>
            <Route path='/articles/:id/edit' element= {<PostPage/>}></Route>
            <Route path='/jadwal' element = {<CalendarPage/>}></Route>
            
            <Route path='/authentication' element= {<AuthenticationPage/>}></Route>
            <Route path='/dashboard' element= {<Dashboard/>}></Route>
            <Route path='/projects' element= {<ProjectPage/>}></Route>
            <Route path='/search' element= {<SearchResult/>}></Route>
            <Route path='/learn' element= {<LearnPage/>}></Route>
            <Route path='/video' element= {<VideoConferenceHomeScreen/>}></Route>
            <Route path='/video/:id' element= {<RoomPage/>}></Route>
            <Route path='/learn/:id' element= {<ContentLearnPage/>}></Route>
            <Route path='/learn/add' element= {<LearnAddPage/>}></Route>
            <Route path='/learn/:id/addNote' element= {<AddNotePage/>}></Route>
            <Route path='/learn/:id/editNote' element={<EditNotePage/>}></Route>
            <Route path='/try-query/' element={<QueryScreen/>}></Route>
            <Route path='*' element= {<ErrorPage/>}></Route>
    </Routes>
    </Router>
   
    
  )
}

export default App
