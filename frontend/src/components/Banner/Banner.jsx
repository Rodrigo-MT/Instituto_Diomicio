import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ReactPlayer from "react-player";
import styles from "./Banner.module.css";
import handImage from "../../assets/images/hand.webp";
import playIcon from "../../assets/images/play.svg";
import nossaHistoriaVideo from "../../assets/videos/nossa-historia.mp4"; // Importe o vídeo

const Banner = () => {
  // Refs para animações
  const container = useRef();
  const h1Line = useRef();
  const contentP = useRef();
  const contentButton = useRef();
  const playVideo = useRef();
  const handImg = useRef();

  // Estado para controle do vídeo
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const handleOpenVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setIsVideoReady(false);
  };

  useGSAP(() => {
    // Animação do banner (bg e addition)
    gsap.from([`.${styles.bannerAdditionBg}`, `.${styles.bannerBg}`], {
      duration: 1,
      width: 0,
      skewX: 2,
      ease: "power3.inOut",
    });

    // Animação dos elementos de texto
    gsap.from(
      [h1Line.current, contentP.current, contentButton.current, playVideo.current],
      {
        x: -100,
        skewX: 2,
        duration: 1,
        ease: "power3.out",
      }
    );

    // Animação da imagem da mão
    gsap.from(handImg.current, {
      x: -100,
      skewX: 2,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, { scope: container });

  return (
    <section className={styles.banner} ref={container}>
      <div className={styles.bannerAdditionBg}></div>
      <div className={styles.bannerBg}></div>

      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.bannerInner}>
            <div className={styles.content}>
              <div className={styles.contentInner}>
                <h1>
                  <div className={styles.line} ref={h1Line}>
                    <span>Instituto Diomício Freitas</span>
                  </div>
                </h1>
                <p ref={contentP}>
                  Conheça o instituto de educação especial que promove a
                  inclusão social para jovens e adultos. Nosso objetivo consiste
                  em promover um ambiente benéfico para jovens e adultos com
                  deficiência intelectual, preparando e qualificando-os para o
                  mercado de trabalho.
                </p>
                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={styles.btnSobre}
                    onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                    ref={contentButton}>
                    Sobre
                  </button>
                </div>
                <button
                  className={styles.playVideo}
                  onClick={handleOpenVideo}
                  aria-label="Assistir vídeo nossa história"
                  ref={playVideo}
                >
                  <div className={styles.cover}></div>
                  <span>
                    <img src={playIcon} alt="Ícone de play" />
                    Nossa história
                  </span>
                </button>
              </div>
            </div>
            <div className={styles.image}>
              <div className={styles.imageInner}>
                <img src={handImage} alt="Mãos se ajudando" ref={handImg} />
                <div className={styles.featureBanner}>Faça a diferença</div>
                <div className={`${styles.featureBanner} ${styles.green}`}>
                  Procure-nos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Vídeo */}
      {showVideo && (
        <div className={styles.videoModal}>
          <div className={styles.modalOverlay} onClick={handleCloseVideo} />

          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={handleCloseVideo}
              aria-label="Fechar modal de vídeo"
            >
              &times;
            </button>

            {!isVideoReady && (
              <div className={styles.videoLoading}>Carregando vídeo...</div>
            )}

            <ReactPlayer
              url={nossaHistoriaVideo}
              controls
              width="100%"
              height="100%"
              playing={showVideo}
              onReady={() => setIsVideoReady(true)}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    disablePictureInPicture: true
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;