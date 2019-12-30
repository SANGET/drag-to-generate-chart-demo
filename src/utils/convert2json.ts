export const convertXlsxToJson = (oEvent) => {
  return new Promise((resolve) => {
    // Get The File From The Input
    const oFile = oEvent.target.files[0];
    const sFilename = oFile.name;
    // Create A File Reader HTML5
    const reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = (e) => {
      let data = e.target.result;
      data = new Uint8Array(data);
      const workbook = XLSX.read(data, { type: 'array' });
      const result = {};
      workbook.SheetNames.forEach((sheetName) => {
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        const res: any[] = [];
        const [sheetHeader, ...sheetData] = roa;
        sheetData.forEach((sheet) => {
          const itemData = {};
          sheet.forEach((item, idx) => {
            itemData[sheetHeader[idx]] = item;
          });
          res.push(itemData);
        });
        if (roa.length) result[sheetName] = res;
      });

      const getArray = (res) => {
        if (!Array.isArray(res)) {
          Object.keys(res).forEach((item) => {
            getArray(res[item]);
          });
        } else {
          resolve(res);
        }
      };
      getArray(result);
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsArrayBuffer(oFile);
  });
};
