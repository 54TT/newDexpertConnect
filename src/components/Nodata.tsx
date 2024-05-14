function Nodata() {
    return (
        <p style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '30px'
        }}><img src="/noData.svg" style={{width: '13%'}}
                alt=""/><span style={{fontSize: '20px', color: 'rgb(220,220,220)', marginTop: '15px'}}>No data</span>
        </p>
    );
}

export default Nodata;