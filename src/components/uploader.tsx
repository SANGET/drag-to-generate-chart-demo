import React, { useState } from 'react';
import { Container, Grid, Button } from '@deer-ui/core';
import { convertXlsxToJson } from '../utils/convert2json';

const UploadFile = ({
  onLoadFile
}) => {
  const [loadedData, setLoadedData] = useState();
  const isLoaded = !!loadedData;
  return (
    <Container className={`file-loader${isLoaded ? ' has-data' : ''}`} fluid>
      <div className="section-mark"></div>
      <Grid container className="p10 content">
        <input
          id="LoadFile"
          accept=".xlsx"
          style={{
            position: 'absolute',
            zIndex: -1,
            opacity: 0
          }}
          type="file" onChange={(e) => {
            convertXlsxToJson(e)
              .then((resData) => {
                onLoadFile && onLoadFile(resData);
                setLoadedData(resData);
              });
          }}
        />
        <Button
          className="mr10"
          icon="upload"
          onClick={(e) => {
            document.querySelector('#LoadFile').click();
          }}
        >
        Load xlsx
        </Button>
        <Button
          hola
          className="mr10"
          icon="cloud-upload-alt"
          onClick={(e) => {
            import('../utils/carsdata.json')
              .then((res) => {
                onLoadFile(res.Cars);
                setLoadedData(res.Cars);
              });
          }}
        >
        Load default xlsx
        </Button>
        <Button
          className="mr10"
          hola
          icon="file-download"
          color="black"
          onClick={(e) => {
          // document.querySelector('#LoadFile').click();
            window.open('/Cars3.0.xlsx');
          }}
        >
          Download default xlsx
        </Button>
        {
          !!loadedData && (
            <Button
              hola
              icon="file-pdf"
              color="green"
              className="mr10"
              onClick={(e) => {
                const w = window.open();
                w.document.write(JSON.stringify(loadedData));
              }}
            >
            Perview loaded Data
            </Button>
          )
        }
        <span className="flex"></span>
        <Button
          className="mr10"
          hola
          color="black"
          icon="github"
          s="b"
          onClick={(e) => {
          // document.querySelector('#LoadFile').click();
            window.open('https://github.com/SANGET/drag-to-generate-chart-demo');
          }}
        >
          View in GitHub
        </Button>
      </Grid>
    </Container>
  );
};

export default UploadFile;
