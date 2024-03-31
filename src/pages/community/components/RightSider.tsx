import RightCard from './RightCard';
function CommunityRight() {
  return <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <RightCard  title={'Watch List'}/>
    <RightCard title={'New Pairs'}/>
    <RightCard title={'Trending'}/>
  </div>
}
export default CommunityRight;