import React, { useState } from 'react';
import styles from './About.module.css';
import Slider from './Slider/Slider';
import Newsletter from './Newsletter/Newsletter';

const About = () => {
  // Definindo "Sobre Nós" como valor inicial do estado
  const [activeContent, setActiveContent] = useState('Sobre Nós');

  const contents = {
    "Sobre Nós": "O Instiuto Diomício Freitas procura preparar, qualificar e encaminhar jovens com deficiência intelectual ao mercado de trabalho, oportunizando a inclusão social e o exercício da cidadania, se consodolidando como referência na qualificação de jovens e adultos para o mercado de trabalho. Ao longo de mais 30 anos de atividades, Instituto Diomício Freitas, tem realizado um grande trabalho junto a comunidade dando importância e relevância na educação especial.",
    "Como Surgiu": "O Instituto de Educação Especial Diomicio Freitas, uma instituição filantrópica sem fins lucrativos, foi fundada no ano de 1985 com o objetivo de atender jovens com deficiência intelectual. A instituição é vinculada à Associação Pestalozzi. mantido por uma diretoria e por voluntários da comunidade.",
    "Locomoção Independente": `Proporciona aos aprendizes condições adequadas e seguras em locomover-se para sua residência, instituição, trabalho e comunidade utilizando o transporte ou demais recursos da Comunidade com Independência e autonomia.   
Tem como objetivo desenvolver habilidades e competências para o aprendiz locomover-se com responsabilidade.
 *São utilizados atividades pedagógicas teóricas e práticas.
`,
    "Iniciação": `Consiste em oferecer atividades básicas e observações de situações reais de trabalho visando o desenvolvimento de habilidades e competências profissionais e sociais que dizem respeito a "saber","conhecer","fazer" "ser" e "conviver". Oportunizando conhecimentos técnicos e específicos de cada profissão.
Tem o objetivo de pesquisar e avaliar as competências do aprendiz. 
*São desenvolvidas atividades de identidade pessoal,  higiene pessoal e do ambiente e identidade profissional.
`,
    "Pré-qualificação": `Consiste em oferecer maior variedade de atividades laborais e  teóricas desenvolvendo conhecimentos e habilidades sobre determinada função profissional.
O foco profissional divide-se em três habilidades: as básicas, as de gestão e as específicas.
Básicas: Constroem a identidade profissional, a informação profissional, atividades laborais no mercado de trabalho, oportunidade  e formação profissional, noções de legislação trabalhista e segurança no trabalho.  Gestão: Desenvolvem competências de auto gerenciar a sua vida profissional e pessoal tratando termos como preparação profissional e busca do emprego, relações interpessoais no ambiente de trabalho e autogerenciamento. Específica: É oferecido aos aprendizes atividades práticas que possibilitem vivenciar a realidade no mercado de trabalho. 
Tem por objetivo  desenvolver atividades relacionadas a uma função profissional, possibilitando a aquisição de conhecimentos compatíveis com as exigências do mercado de trabalho.
`,
    "Sevil": "O Serviço de Vivências Laborais é ofertado àqueles educandos sem perspectiva de ingresso no processo de qualificação profissional e ou de inclusão no mercado de trabalho, mas que apresentam possibilidades de executar uma atividade laboral não remunerada, bem como de desenvolver conteúdos que contribuam para a promoção de sua independência pessoal e inclusão social.",
    "Educação Física": `É uma atividade relacionada à saúde, atividade física e qualidade de vida.
Tem como objetivo facilitar o raciocínio, a lógica, esforço físico, resistência, flexibilidade e concentração para q se possibilite uma vida com saúde, equilíbrio e qualidade.
* são desenvolvidos exercícios nos aparelhos de (bicicleta, esteira e simulador de caminhada), caminhada orientada, alongamento e circuitos.`
  };

  return (
    <section className={styles.aboutSection} id="about">
      <div className={styles.container}>
        <h1 className={styles.title}>Sobre Nós</h1>

        <div className={styles.mainWrapper}>
          {/* Área de Botões (Destaque) */}
          <div className={styles.navPanel}>
            {Object.keys(contents).map((key) => (
              <button
                key={key}
                data-key={key}
                className={`${styles.menuButton} ${activeContent === key ? styles.active : ''}`}
                onClick={() => setActiveContent(key)}
              >
                {formatButtonLabel(key)}
              </button>
            ))}
          </div>

          {/* Área de Conteúdo + Slider (Integrados) */}
          <div className={styles.contentArea}>
            <div className={styles.textDisplay}>
              <p>{contents[activeContent]}</p>
            </div>
            <Slider />
          </div>
        </div>
      </div>
      <Newsletter /> {/* Adicionado aqui */}
    </section>

  );
};

// Helper para formatar labels dos botões
const formatButtonLabel = (key) => {
  return key.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default About;