import NEWS from "./components/NEWS"
import SearchSection from "./components/SearchSection"

const Home = () => {
  return (
    <div className='flex w-full h-full custom-scrollbar'>
      <NEWS/>
      <SearchSection/>
    </div>
  )
}

export default Home