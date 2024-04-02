function CommingSoon({hei}: any) {
    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: 'black',
            opacity: '0.8',
            top: '0',
            color: 'gray',
            textAlign: 'center',
            lineHeight: hei,
            borderRadius:'7px'
        }}>
            Coming soon
        </div>
    );
}

export default CommingSoon;