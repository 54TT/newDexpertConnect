export function createLoginMessage(payload: any): string {
    const typeField = "Ethereum";
    const header = `${payload.domain} wants you to sign in with your ${typeField} account:`;
    let prefix = [header, payload.address].join("\n");
    prefix = [prefix, payload.statement].join("\n\n");
    if (payload.statement) {
      prefix += "\n";
    }
    const suffixArray = [];
    const versionField = `Version: ${payload.version}`;
    suffixArray.push(versionField);
  
    const nonceField = `Nonce: ${payload.nonce}`;
    suffixArray.push(nonceField);
    const issuedAtField = `Issued At: ${payload.issued_at}`;
    suffixArray.push(issuedAtField);
    const expiryField = `Expiration Time: ${payload.expiration_time}`;
    suffixArray.push(expiryField);
    if (payload.invalid_before) {
      const invalidBeforeField = `Not Before: ${payload.invalid_before}`;
      suffixArray.push(invalidBeforeField);
    }
    const suffix = suffixArray.join("\n");
    return [prefix, suffix].join("\n");
  }