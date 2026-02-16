import Hero from "../components/Hero"
import Features from "../components/Features"
import HowItWorks from "../components/HowItWorks"
import Roles from "../components/Roles"
import CTA from "../components/CTA"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

const Home=()=>{
    return (
        <>
        <div><Navbar/></div>
        <div><Hero/></div>
        <div><Features/></div>
        <div><HowItWorks/></div>
        <div><Roles/></div>
        <div><CTA/></div>
        <div><Footer/></div>
        </>
    )
}

export default Home