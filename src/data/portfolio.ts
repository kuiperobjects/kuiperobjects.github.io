export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    demo?: string;
    [key: string]: string | undefined;
  };
  media?: {
    src: string;
    alt: string;
    type: 'video' | 'image';
  };
}

export const projects: Project[] = [
  {
    id: 'text-stats',
    title: 'Text Stats',
    description: 'A library providing text statistics for applications like author verification and auto-grading systems. It includes functions to compute metrics such as word frequency, sentence length, and readability scores. This suite of text analysis tools is instrumental in educational and forensic linguistics applications.',
    technologies: ['Python', 'NLP', 'Text Analysis', 'Statistics', 'Educational Technology'],
    links: {
      github: 'https://github.com/kuiperobjects/Text-Stats'
    },
    media: {type:'video',
      src:'https://www.youtube.com/watch?v=z3hMX65Khtg&list=PLRcHmntfmJ8CnSmj4C284-a1euH518aQa',
      alt:''
    }
  },
  {
    id: 'preprocessors',
    title: 'NLP Preprocessors',
    description: 'This repository contains text preprocessing functions utilizing four major Natural Language Processing (NLP) libraries for global language support. It demonstrates preprocessing techniques across multiple NLP libraries, providing a comparative resource for developers selecting suitable tools for multilingual NLP tasks.',
    technologies: ['Python', 'NLTK', 'spaCy', 'Stanford CoreNLP', 'Spark NLP', 'Text Processing'],
    links: {
      github: 'https://github.com/kuiperobjects/Preprocessors'
     }
  },
    {
      id: 'image-translation',
      title: 'Image to Translated Text',
      description: 'This tool extracts text from images and translates it into various languages supported by Google. Using Optical Character Recognition (OCR) to extract text from .pdf documents and translation services, it enables understanding content from images in different languages, particularly useful for translating documents without selectable text.',
      technologies: ['Python', 'OCR', 'Machine Translation', 'Image Processing', 'Document Analysis'],
      links: {
        github: 'https://github.com/kuiperobjects/Image-to-Translated-Text'
      }
    },
  {
    id: 'covid-modeling',
    title: 'Peak Deaths: COVID-19 Modeling',
    description: 'This project employs Exploratory Data Analysis (EDA), Linear Regression, and Time Series Models to predict the peak of the COVID-19 pandemic. The analysis combines EDA with predictive modeling in a single workflow, allowing for both understanding past trends and forecasting future outcomes - crucial for informed decision-making during a pandemic.',
    technologies: ['Python', 'Jupyter', 'Pandas', 'Matplotlib', 'Seaborn', 'Statistical Modeling'],
    links: {
      github: 'https://github.com/kuiperobjects/Peak-Deaths--Covid-19-Modeling'
    }
  },
  {
    id: 'ebook-audiobook',
    title: 'Ebook to Audiobook',
    description: 'This script converts text from eBooks into speech, facilitating the creation of audiobooks. The Python script reads text from .docx and .pdf files, processes it, and uses a text-to-speech library to generate audio output in .mp3 format. This automation enhances accessibility and offers an alternative way to consume written content.',
    technologies: ['Python', 'Text-to-Speech', 'Document Processing', 'Audio Generation', 'Accessibility'],
    links: {
      github: 'https://github.com/kuiperobjects/Ebook-to-Audiobook'
    }
  },
  {
    id: 'foodshare-nyc',
    title: 'FoodShare NYC',
    description: 'A Django-based web application designed to connect individuals with surplus food to those in need, aiming to reduce food waste. The project utilizes technology to address food insecurity and waste, fostering community engagement and promoting sustainability through peer-to-peer food sharing.',
    technologies: ['Django', 'Python', 'Web Development', 'Database Design', 'Community Technology'],
    links: {
      github: 'https://github.com/kuiperobjects/FoodShareNYC'
    }
  }
];