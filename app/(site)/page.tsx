"use client";



import Scrollonepage from "../components/Scrollonepage";
import Scrolltwopage from "../components/Scrolltwopage";
import Scrollthreepage from '../components/Scrollthreepage';
import Bestsell from '../components/bestsell';
import ReactSlick from "../components/ReactSlickBestsellers";
import Scrollfivepage from '../components/Scrollfivepage';
import Branches from '../components/branches'
import ReactslickBranches from '../components/ReactSlickBranches';

const HomePage: React.FC = () => {
  return (
    <>
    
     
        <Scrollonepage />
        <Scrolltwopage/>
        <Scrollthreepage/>
        <Bestsell/>
        <ReactSlick/>
        <Scrollfivepage/>
        <Branches/>
        <ReactslickBranches/>
       
     
    </>
  );
}
export default HomePage;

