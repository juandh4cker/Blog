import { useState, useRef, useEffect, useCallback } from 'react';
import { Image as HeroImage } from '@heroui/react';

import { Modal } from '@/components';
import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroImage {...props}>{props.children}</HeroImage>,
    kingdomProps: {},
  },
  image: {
    component: (props) => <BaseImage {...props}>{props.children}</BaseImage>,
    kingdomProps: {},
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  image: {
    kingdom: 'image',
    props: {},
  },
};

const defaultKind = 'image';

function ResponsiveImageBox({ src, alt }) {
  const imgRef = useRef(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const computeTargetSize = useCallback((nw, nh) => {
    if (!nw || !nh) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxW = vw * 0.8; // 80vw
    const maxH = vh * 0.8; // 80vh
    const minW = vw * 0.3; // 30vw
    const minH = vw * 0.3; // 30vw

    const maxScale = Math.min(maxW / nw, maxH / nh);
    const minScale = Math.max(minW / nw, minH / nh);

    let scale;
    if (minScale <= maxScale) {
      scale = Math.min(Math.max(minScale, 1), maxScale);
      if (maxScale < 1) scale = maxScale;
    } else {
      scale = maxScale;
    }

    if (!isFinite(scale) || scale <= 0) scale = 1;

    setSize({ width: Math.round(nw * scale), height: Math.round(nh * scale) });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    function onLoad() {
      const nw = img.naturalWidth || img.width;
      const nh = img.naturalHeight || img.height;
      setNatural({ w: nw, h: nh });
      computeTargetSize(nw, nh);
    }

    if (img.complete && img.naturalWidth) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad);
      return () => img.removeEventListener('load', onLoad);
    }
  }, [src, computeTargetSize]);

  useEffect(() => {
    function onResize() {
      if (natural.w && natural.h) computeTargetSize(natural.w, natural.h);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [natural, computeTargetSize]);

  return (
    <div className="flex items-center justify-center">
      <div style={{ minWidth: '30vw' }} className="flex items-center justify-center">
        <HeroImage
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: size.width ? `${size.width}px` : 'auto',
            height: size.height ? `${size.height}px` : 'auto',
            objectFit: 'contain',
            maxWidth: '80vw',
            maxHeight: '80vh',
          }}
          className="select-none rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}

const BaseImage = ({ className, withModal, withWrapper, title, src, alt, children, ...props }) => {
  const [onOpen, setOnOpen] = useState();

  const imageProps = {
    src,
    alt,
    className,
    ...props,
  };

  return (
    <>
      {withModal ? (
        <div className="flex items-center justify-center cursor-pointer" onClick={onOpen}>
          {withWrapper ? (
            <ResponsiveImageBox src={src} alt={alt || title || ''} herouiProps={imageProps} />
          ) : (
            <HeroImage {...imageProps}>{children}</HeroImage>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {withWrapper ? (
            <ResponsiveImageBox src={src} alt={alt || title || ''} herouiProps={imageProps} />
          ) : (
            <HeroImage {...imageProps}>{children}</HeroImage>
          )}
        </div>
      )}

      {withModal ? (
        <Modal setOnOpen={setOnOpen} isDivided hideCloseButton>
          <Modal.Body className="flex items-center justify-center">
            {withWrapper ? (
              // dentro del modal también usamos el wrapper (imagen grande calculada)
              <ResponsiveImageBox
                src={src}
                alt={alt || title || ''}
                herouiProps={{
                  className: 'w-[80vw] object-contain rounded-lg shadow-lg',
                  ...props,
                }}
              />
            ) : (
              <HeroImage
                className="w-[80vw] object-contain rounded-lg shadow-lg"
                src={src}
                alt={alt || title || ''}
                {...props}
              />
            )}
          </Modal.Body>
        </Modal>
      ) : null}
    </>
  );
};

const Image = ({ kind, children, ...props }) => {
  const allProps = {
    ...props,
  };

  return (
    <KindsManager
      baseProps={baseProps}
      kingdoms={kingdoms}
      kinds={kinds}
      kind={kind}
      defaultKind={defaultKind}
      {...allProps}
    >
      {children}
    </KindsManager>
  );
};

export default Image;
