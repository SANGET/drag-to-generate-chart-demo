import React, { useState } from 'react';
import { Container } from '@deer-ui/core/container';
import { Grid } from '@deer-ui/core/grid';
import { Button } from '@deer-ui/core/button';
import Alert from '@deer-ui/core/alert/alert';
import { ShowModal } from '@deer-ui/core/modal';
import { convertXlsxToJson } from '../utils/convert2json';

const HowToUse = () => {
  return (
    <div className="how-to-use">
      <Alert
        title="How to use this app"
        texts={[
          'First step: you need to upload a xlsx as data source.',
          'Second step: drag a Chart or Table from left panel to middle panal.',
          'Third step: edit the props of Chart or Table in right panel to setup data fields.',
        ]}
      />
      <hr />
      <h4 className="ps10">The props meaning of this app</h4>
      <img
        style={{ maxWidth: '100%' }}
        src="/how-to-use.jpg"
        alt="how-to-use"
      />
    </div>
  );
};

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
        <Button
          className="mr10"
          hola
          icon="question"
          color="black"
          onClick={(e) => {
          // document.querySelector('#LoadFile').click();
            // window.open('/how-to-use.jpg');
            ShowModal({
              title: 'How to use',
              width: 1200,
              children: <HowToUse />
            });
          }}
        >
          How to use
        </Button>
        {
          !!loadedData && (
            <Button
              hola
              icon="file-pdf"
              color="green"
              className="mr10"
              onClick={(e) => {
                ShowModal({
                  title: 'Data source',
                  width: 1200,
                  children: () => (
                    <div className="p20">
                      {JSON.stringify(loadedData)}
                    </div>
                  )
                });
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
