import HomeFeed from './HomeFeed'

function Home() {
  return (
    <section className='home-page'>
      <header className='home-page__hero'>
        <p className='home-page__eyebrow'>Community</p>
        <h1 className='home-page__title'>Discover upcoming activities</h1>
        <p className='home-page__subtitle'>
          Browse open events, search by interests, and join what fits your mood.
        </p>
      </header>
      <HomeFeed />
    </section>
  )
}

export default Home
