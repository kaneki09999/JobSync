import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useMatch, matchPath } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MyNavbar from './components/navbar';
import FindJob from './Pages/FindJob';
import FindEmployer from './Pages/findemployer';
import Home from './Pages/Home';
import RegistrationForm from './Pages/Registration';
import Footer from './components/Footer';
import SignInForm from './Pages/SignInForm';
import EmployerRegistrationForm from './Pages/EmployerRegistration';
import LogoIcon from './components/LogoIcon';
import EmailVerification from './Pages/EmailVerification';
import SignInEmployer from './Pages/SignInEmployer';
import JobDetails from './Pages/JobDetails';
import { AuthProvider, useAuth } from './AuthContext'; 
import DashboardApplicant from './Pages/Applicants/Home';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import CompanyProfilePage from './Pages/Employer/CompanyProfile';
import CompanySocialMedia from './Pages/Employer/SocialMedia';
import FoundingInfo from './Pages/Employer/FoundingInfo';
import CompanyContactPage from './Pages/Employer/Contact';
import JobAlerts from './Pages/Applicants/JobAlerts';

{/* Applicant Dashboard Pages */}
import Overview from './Pages/Applicants/ApplicantDashboard/Overview';
import AppliedJobs from './Pages/Applicants/ApplicantDashboard/AppliedJobs';
import FavoriteJobs from './Pages/Applicants/ApplicantDashboard/FavoriteJobs';
import ApplicantSettings from './Pages/Applicants/ApplicantDashboard/ApplicantSettings';
import PasswordSettings from './Pages/Applicants/ApplicantDashboard/PasswordSettings';
import AccountSetting from './Pages/Applicants/ApplicantDashboard/AccountSettings';

import EmployerDetails from './Pages/Applicants/employerdetails';

import ApplicantProfile from './Pages/Applicants/applicantprofile';


{/* Applicant Profile Tabs */}
import Personal from './Pages/Applicants/ApplicantProfile/personal';
import Profile from './Pages/Applicants/ApplicantProfile/address';
import Socmedlinks from './pages/applicants/applicantprofile/socmedlinks';


{/* Employer Dashboard Pages */}
import EmployerOverview from './Pages/Employer/EmployerDashboard/EmployerOverview';
import EmployerProfile from './Pages/Employer/EmployerDashboard/EmployerProfile';
import PostJobs from './Pages/Employer/EmployerDashboard/PostJob';
import MyJobs from './Pages/Employer/EmployerDashboard/MyJobs';
import EmployerMessage from './Pages/Employer/EmployerDashboard/EmployerMessage';
import SavedApplicant from './Pages/Employer/EmployerDashboard/SavedApplicant';
import EmployerSettings from './Pages/Employer/EmployerDashboard/EmployerSettings';
import AccountSettings from './pages/employer/employerdashboard/employersettings/accountsettings';


import ApplicantDetails from './Pages/Employer/EmployerDashboard/applicantdetails';


// import Step1ScreeningQuestions from './Pages/Employer/EmployerDashboard/EmployerMessage';


import ViewApplications from './Pages/Employer/EmployerDashboard/ViewApplications';

import FindApplicant from './Pages/Employer/findapplicant';
import Applications from './Pages/Employer/Applications';

import Step1ScreeningQuestions from './Pages/Employer/EmployerDashboard/step1'; 
// import Step2ScreeningQuestions from './Pages/Employer/EmployerDashboard/step2';

{/* Employer Settings Pages */}
import CompanySettings from './pages/employer/employerdashboard/employersettings/companysettings';
import SocmedSettings from './pages/employer/employerdashboard/employersettings/socmedsettings';
import FoundingSettings from './pages/employer/employerdashboard/employersettings/foundingsettings';

import EmployerDashboard from './Pages/Employer/Dashboard';
import CustomerSupport from './Pages/CustomerSupport';

import HomeEmployer from './Pages/Employer/Home';
import HeaderComponent from './components/HeaderComponent';
import SearchJobs from './components/searchbar';
import JobsAlert from './Pages/Applicants/ApplicantDashboard/JobsAlert';
import HeaderProgress from './components/headerProgress';
import CompletedProfile from './Pages/Employer/CompletedProfile';
import SemiFooter from './components/SemiFooter';
import { JobProvider } from './JobContext';
import Publisher from './Video/Publisher';
import { Subscriber } from './Video/Subscriber';
import Interview from './Pages/Employer/interview';
import SearchJobResults from './components/JobSearchResult';
import NotFound from './components/NotFound';
import ResubmitRegistration from './Pages/ResubmitRegistration';
import CheckToken from './components/CheckToken';
import ResumeBuilder from './Pages/Resume/ResumeBuilder';
import ResumeAIForm from './Pages/Resume/CreaeteResume';
import ForgotPassword from './Pages/ForgotPassword';
import MapComponent from './Pages/Applicants/Mapp';
import EditJobPosted from './Pages/EditJobPosted';
import TermsAndConditions from './components/termsandcondition';
import EmployerTermsAndConditions from './components/empterms&conditions';

function Layout({ userId, setUserId }) {
  const location = useLocation();
  const { user } = useAuth();
  const isResubmitPage = matchPath('/resubmit/:firstname/:employer_id/:token', location.pathname);
  const hideSearchJobs = location.pathname === '/registration' || 
                         location.pathname === '/registration_employer' || 
                         location.pathname === '/candidate_login' || 
                         location.pathname === '/forgotPassword' ||
                         isResubmitPage || 
                         location.pathname === '/employer_login';
  const centeredIcon = location.pathname === '/email_verification';
  
  const hideHeader = location.pathname === '/customersupport';

  const hideHeadersAndNavigations = location.pathname === '/resume-builder' ||
                                    location.pathname === '/create-resume';

  const isPublisherPath = useMatch('/employer/publisher/:application_id/:job_id');
  const isSubscriberPath = useMatch('/applicant/subscriber/:application_id/:job_id');
  const resumeBuilder = useMatch('/resume-builder');
  const createResume = useMatch('/create-resume');
  const hideNavigationAndFooter = isSubscriberPath || isPublisherPath || resumeBuilder || createResume;
  

  const hideFooter = location.pathname === '/employer/companyprofile' ||
                     location.pathname === '/employer/foundinginfo' ||
                     location.pathname === '/employer/socialmedia' ||
                     location.pathname === '/Complete' ||
                     location.pathname === '/complete' ||
                     location.pathname === '/employer/contact';
  
  const hideEmployerHeader = location.pathname === '/employer/companyprofile' ||
                             location.pathname === '/employer/foundinginfo' ||
                             location.pathname === '/employer/socialmedia' ||
                             location.pathname === '/Complete' ||
                             location.pathname === '/complete' ||
                             location.pathname === '/employer/contact';

const showHeader = [
  '/findjob', 
  '/jobdetails/:job_id', 
  '/findemployer', 
  '/jobAlerts', 
  '/employerdetails', 
  '/employer/findapplicant', 
  '/employer/applications', 
  '/employer/interview', 
  '/applicantprofile', 
  '/applicantdetails/:application_id'
].some((path) =>
  location.pathname.startsWith(path.replace(':job_id', '').replace(':application_id', ''))
);

const getPageTitle = () => {
  if (location.pathname.startsWith('/jobdetails/')) {
    return 'Job Details';
  }
  if (location.pathname.startsWith('/employerdetails/')) {
    return 'Single Employer';
  }
  if (location.pathname.startsWith('/applicantprofile')) {
    return 'Profile';
  }
  if (location.pathname.startsWith('/applicantdetails/')) {
    return 'Applicant Details';
  }
  switch (location.pathname) {
    case '/findjob':
      return 'Find Job';
    case '/findemployer':
      return 'Employers';
    case '/jobAlerts':
      return 'Job Alert';
    case '/employerdetails':
      return 'Single Employer';
    case '/employer/findapplicant':
      return 'Applicants';
    case '/employer/applications':
      return 'Applications';
    case '/employer/interview':
      return 'Interviews Schedule';
    default:
      return '';
  }
};

const getBreadcrumbs = () => {
  if (location.pathname.startsWith('/jobdetails/')) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Find Job', path: '/findjob' },
      { label: 'Job Details', path: location.pathname },
    ];
  }
  if (location.pathname.startsWith('/employerdetails/')) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Employers', path: '/findemployer' },
      { label: 'Single Employer', path: location.pathname },
    ];
  }
  if (location.pathname.startsWith('/applicantprofile')) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Profile', path: location.pathname },
    ];
  }
  if (location.pathname.startsWith('/employer/interview')) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Interviews Schedule', path: location.pathname },
    ];
  }
  if (location.pathname.startsWith('/applicantdetails/')) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Applications', path: '/employer/applications' },
      { label: `Applicant Details`, path: location.pathname },
    ];
  }
  switch (location.pathname) {
    case '/findjob':
      return [{ label: 'Home', path: '/' }, { label: 'Find Job', path: '/findjob' }];
    case '/findemployer':
      return [{ label: 'Home', path: '/' }, { label: 'Employers', path: '/findemployer' }];
    case '/jobAlerts':
      return [{ label: 'Home', path: '/' }, { label: 'Job Alert', path: '/jobAlerts' }];
    case '/employerdetails':
      return [
        { label: 'Home', path: '/' },
        { label: 'Employers', path: '/findemployer' },
        { label: 'Single Employer', path: '/employerdetails' },
      ];
    case '/employer/applications':
      return [
        { label: 'Home', path: '/home' },
        { label: 'Applications', path: '/employer/applications' },
      ];
    case '/employer/findapplicant':
      return [
        { label: 'Home', path: '/home' },
        { label: 'Find Applicant', path: '/employer/findapplicant' },
      ];
    default:
      return [];
  }
};

  const renderHomePage = () => {
    if (!user) {
      return <Home />;
    } else if (user && user.userType === 'applicant') {
      return <Home />;
    } else if (user && user.userType === 'employer') {
      return <ProtectedRoute> <EmployerOverview /> </ProtectedRoute>;
    }
    return <Home />;
  };

  return (
    <>  
      {!hideNavigationAndFooter && !hideEmployerHeader && (
        <MyNavbar userId={userId} setUserId={setUserId} />
      )}

      {!hideHeader && !hideNavigationAndFooter ? (
        centeredIcon ? (
          <LogoIcon centered />
        ) : hideEmployerHeader ? (
          <HeaderProgress />
        ) : user ? (
          <HeaderComponent />
        ) : !hideSearchJobs ? (
          <SearchJobs />
        ) : (
          <LogoIcon />
        )
      ) : null}

      {!hideNavigationAndFooter && showHeader && (
        <Header pageTitle={getPageTitle()} breadcrumbs={getBreadcrumbs()} />
      )}


      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={renderHomePage()} />
        <Route path='/findjob' element={<FindJob/>} />
        <Route path='/findemployer' element={<FindEmployer />} />
        <Route path='/candidate_login' element={<SignInForm setUserId={setUserId} />} />
        <Route path='/employer_login' element={<SignInEmployer />} />
        <Route path='/registration' element={<RegistrationForm />} />
        <Route path='/registration_employer' element={<EmployerRegistrationForm />} />
        <Route path='/email_verification' element={<EmailVerification />} />
        <Route path="/jobdetails/:job_id" element={<JobDetails />} />
        <Route path='/searchjob' element={ <SearchJobResults />} />  
        <Route path='/customersupport' element={ <CustomerSupport />} />  
        <Route path='/resubmit/:firstname/:employer_id/:token' element={ <ResubmitRegistration />} /> 
        <Route path='/checkToken' element={ <CheckToken />} /> 
        <Route path='/forgotPassword' element={ <ForgotPassword />} /> 
        <Route path='/map' element={ <MapComponent />} /> 

        {/* Resume Builder */}
        <Route path='/resume-builder' element={<ProtectedRoute> <ResumeBuilder /> </ProtectedRoute>} /> 
        <Route path='/create-resume' element={<ProtectedRoute> <ResumeAIForm /></ProtectedRoute> } /> 
        {/* For Employer */}
        <Route path="/home" element={<ProtectedRoute> <HomeEmployer /> </ProtectedRoute> } />
        <Route path='/employer/dashboard' element={<ProtectedRoute> <EmployerDashboard /> </ProtectedRoute> } />
        <Route path='/employer/companyprofile' element={<ProtectedRoute> <CompanyProfilePage /> </ProtectedRoute> } />
        <Route path='/employer/foundinginfo' element={<ProtectedRoute> <FoundingInfo /> </ProtectedRoute> } />
        <Route path='/employer/socialmedia' element={<ProtectedRoute> <CompanySocialMedia /> </ProtectedRoute> } />
        <Route path='/employer/contact' element={<ProtectedRoute> <CompanyContactPage /> </ProtectedRoute> } />

        <Route path='/Complete' element={<ProtectedRoute> <CompletedProfile /> </ProtectedRoute>} />
        <Route path='/employer/findapplicant' element={<ProtectedRoute> <FindApplicant /> </ProtectedRoute> } />
      
      {/* Applicant Dashboard Routing */}
        <Route path='/applicants/overview' element={<ProtectedRoute> <Overview /> </ProtectedRoute> } />
        <Route path='/applicants/appliedjobs' element={<ProtectedRoute><AppliedJobs /> </ProtectedRoute> } />
        <Route path='/applicants/favoritejobs' element={<ProtectedRoute> <FavoriteJobs /> </ProtectedRoute>} />
        <Route path='/applicants/jobsalert' element={<ProtectedRoute> <JobsAlert /> </ProtectedRoute>} />
        <Route path='/applicants/applicantsettings' element={<ProtectedRoute> <ApplicantSettings /> </ProtectedRoute>} />

        <Route path='/applicants/passwordsettings' element={<ProtectedRoute> <PasswordSettings /> </ProtectedRoute>} />
        <Route path='/applicants/accountsettings' element={<ProtectedRoute> <AccountSetting /> </ProtectedRoute>} />

        <Route path='/employerdetails' element={<ProtectedRoute> <EmployerDetails /> </ProtectedRoute>} />

        <Route path='/applicantprofile' element={<ProtectedRoute> <ApplicantProfile /> </ProtectedRoute>} />


        {/* Applicant Profile Tabs Routing*/}

        <Route path='/personal' element={<ProtectedRoute> <Personal /> </ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path='/socmedlinks' element={<ProtectedRoute> <Socmedlinks /> </ProtectedRoute>} />
        <Route path='/employerdetails/:employerId' element={ <EmployerDetails />} />
          

      {/* Employer Dashboard Routing */}
        <Route path='/employer/overview' element={<ProtectedRoute> <EmployerOverview /> </ProtectedRoute>} />
        <Route path='/employer/profile' element={<ProtectedRoute> <EmployerProfile /> </ProtectedRoute>} />
        <Route path='/employer/postjob' element={ <ProtectedRoute> <PostJobs  key={useLocation().pathname}/> </ProtectedRoute> } />
        <Route path='/employer/myjobs' element={<ProtectedRoute> <MyJobs /> </ProtectedRoute>} />
        <Route path='/employer/edit-job-posted/:id' element={<ProtectedRoute> <EditJobPosted /> </ProtectedRoute>} />
        <Route path='/employer/message' element={<ProtectedRoute> <EmployerMessage /> </ProtectedRoute>} />
        <Route path='/employer/savedapplicant' element={<ProtectedRoute> <SavedApplicant /> </ProtectedRoute>} />  
        <Route path='/employer/settings' element={<ProtectedRoute> <EmployerSettings /> </ProtectedRoute>} />
        <Route path='/employer/interview' element={<ProtectedRoute> <Interview /> </ProtectedRoute>} />

        <Route path='/viewapplications/:job_id/:jobTitle' element={<ProtectedRoute> <ViewApplications /> </ProtectedRoute>} />
        <Route path='/employer/applications' element={<ProtectedRoute> <Applications /> </ProtectedRoute>} />  

        <Route path='/applicantdetails/:application_id/:job_id/:applicant_id/:firstname/:lastname' element={<ProtectedRoute> <ApplicantDetails /> </ProtectedRoute>} />


        {/* <Route path='/employer/employermessage' element={<ProtectedRoute> <Step1ScreeningQuestions /> </ProtectedRoute>} /> */}
  
        <Route path='/step2' element={<ProtectedRoute> <Step1ScreeningQuestions /> </ProtectedRoute>} />
      
      {/* Employer Settings Routing */}
        <Route path='/employer/employersettings/companysettings' element={<ProtectedRoute> <CompanySettings /> </ProtectedRoute> } />
        <Route path='/employer/emoployersettings/foundingsettings' element={<ProtectedRoute> <FoundingSettings /> </ProtectedRoute>} />
        <Route path='/employer/employersettings/socmedsettings' element={<ProtectedRoute> <SocmedSettings /> </ProtectedRoute>} />
        <Route path='/employer/employersettings/accountsettings' element={ <ProtectedRoute><AccountSettings /> </ProtectedRoute>} />


      {/* Employer Settings Routing */}
      <Route path='/employer/publisher/:application_id/:job_id' element={ <ProtectedRoute><Publisher /> </ProtectedRoute>} />
      <Route path='/applicant/subscriber/:application_id/:job_id' element={ <ProtectedRoute><Subscriber /> </ProtectedRoute>} />
      <Route path='/termsandconditions' element={<TermsAndConditions />} />
      <Route path='/employerterms&conditions' element={<EmployerTermsAndConditions />} />
      </Routes>
      {!hideNavigationAndFooter && !hideFooter ? <Footer /> : null}
      {hideNavigationAndFooter || !hideFooter ? null : <SemiFooter />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
