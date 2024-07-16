export default function addMethod({ setStatus }: any) {
  return (
    <div className="addMethod">
      {[
        { name: 'Create Wallet', key: 'Create' },
        { name: 'Import Wallet', key: 'Import' },
      ].map((i: any) => {
        return (
          <div className="item" key={i.key} onClick={() => setStatus(i.key)}>
            <p>{i.name}</p>
            <p></p>
          </div>
        );
      })}
    </div>
  );
}
