export enum TabView {
  // Common / DGraph
  INTRO = 'INTRO',
  DATA = 'DATA',
  MODEL = 'MODEL',
  TRAINING = 'TRAINING',
  INFERENCE = 'INFERENCE',

  // TCM Module Specific
  TCM_INTRO = 'TCM_INTRO',
  TCM_PROMPT = 'TCM_PROMPT',
  TCM_BATCH = 'TCM_BATCH',
  TCM_EVAL = 'TCM_EVAL',

  // Vision Module Specific
  CV_INTRO = 'CV_INTRO',
  CV_PIPELINE = 'CV_PIPELINE',
  CV_ARCH = 'CV_ARCH',
  CV_TRAIN = 'CV_TRAIN',
  CV_INFERENCE = 'CV_INFERENCE'
}

export enum Project {
  DGRAPH = 'DGRAPH',
  TCM = 'TCM',
  VISION = 'VISION'
}