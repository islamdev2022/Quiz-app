import React, { useRef, useEffect, useState } from 'react';
import { useWindowSize } from '../QuizzOver';
import Confetti from 'react-confetti';

const ImageComparison = ({ img1Src, img2Src, height }) => {
  const { width } = useWindowSize();
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const [similarityper, setSimilarity] = useState(0);
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);

  const CodeEditorWidth = document.getElementById('header2')?.offsetWidth || 0;

  useEffect(() => {
    const canvas1 = canvasRef1.current;
    const canvas2 = canvasRef2.current;
    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const img1 = new Image();
    const img2 = new Image();

    img1.crossOrigin = 'anonymous';
    img2.crossOrigin = 'anonymous';

    img1.src = img1Src;
    img2.src = img2Src;

    img1.onload = () => {
      setImg1Loaded(true);
      const width = img1.width;
      const height = img1.height;
      canvas1.width = width;
      canvas1.height = height;
      ctx1.drawImage(img1, 0, 0, width, height);
      console.log('Image 1 loaded');
    };

    img1.onerror = (error) => {
      console.error('Error loading image 1:', error);
    };

    img2.onload = () => {
      setImg2Loaded(true);
      console.log('Image 2 loaded');
    };

    img2.onerror = (error) => {
      console.error('Error loading image 2:', error);
    };
  }, [img1Src, img2Src]);

  useEffect(() => {
    if (img1Loaded && img2Loaded) {
      console.log('Both images are loaded, starting comparison...');
      const canvas1 = canvasRef1.current;
      const canvas2 = canvasRef2.current;
      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');

      const width = canvas1.width;
      const height = canvas1.height;

      // Draw the second image on the canvas after resizing
      const img2 = new Image();
      img2.src = img2Src;
      img2.crossOrigin = 'anonymous';

      img2.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(img2, 0, 0, width, height);

        const tempImg = new Image();
        tempImg.src = tempCanvas.toDataURL();
        tempImg.onload = () => {
          canvas2.width = width;
          canvas2.height = height;
          ctx2.drawImage(tempImg, 0, 0);

          // Compare images
          const imgData1 = ctx1.getImageData(0, 0, width, height);
          const imgData2 = ctx2.getImageData(0, 0, width, height);

          let diffPixels = 0;
          const totalPixels = imgData1.data.length / 4; // Each pixel has 4 values (R, G, B, A)

          for (let i = 0; i < imgData1.data.length; i += 4) {
            const r1 = imgData1.data[i];
            const g1 = imgData1.data[i + 1];
            const b1 = imgData1.data[i + 2];
            const a1 = imgData1.data[i + 3];

            const r2 = imgData2.data[i];
            const g2 = imgData2.data[i + 1];
            const b2 = imgData2.data[i + 2];
            const a2 = imgData2.data[i + 3];

            if (r1 !== r2 || g1 !== g2 || b1 !== b2 || a1 !== a2) {
              diffPixels++;
            }
          }

          const similarity = ((totalPixels - diffPixels) / totalPixels) * 100;
          setSimilarity(similarity.toFixed(2));
          console.log(`Similarity: ${similarity.toFixed(2)}%`);
        };
      };
    }
  }, [img1Loaded, img2Loaded, img2Src]); // Trigger comparison after both images are loaded

  return (
    <div>
      
      {similarityper >= 85 && (
        <Confetti
          width={width-CodeEditorWidth -10 }
          height={height}
          className='z-9999999'
        />
      )}
      <canvas ref={canvasRef1} style={{ display: 'none' }} />
      <canvas ref={canvasRef2} style={{ display: 'none' }} />
      <div className="text-center text-white">
        <h2>Similarity: {similarityper}%</h2>
      </div>
    </div>
  );
};

export default ImageComparison;
