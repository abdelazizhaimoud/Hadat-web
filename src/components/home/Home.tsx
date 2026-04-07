import Header from './Header'
import HomeFeed from './HomeFeed'

function Home() {
    console.log('user logged in')
  return (
    <div>
      <Header></Header>
      <HomeFeed></HomeFeed>
      Home
    </div>
  )
}

export default Home
