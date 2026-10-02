
// [name, aliases, caseSensitive]
const DEFS = [
  ['JavaScript', ['JavaScript', 'ES6']],
  ['TypeScript', ['TypeScript']],
  ['React', ['React', 'React.js', 'ReactJS'], true],
  ['Next.js', ['Next.js', 'NextJS']],
  ['Angular', ['Angular']],
  ['Vue', ['Vue', 'Vue.js']],
  ['Redux', ['Redux']],
  ['HTML', ['HTML', 'HTML5']],
  ['CSS', ['CSS', 'CSS3']],
  ['Tailwind CSS', ['Tailwind']],
  ['Bootstrap', ['Bootstrap']],
  ['Node.js', ['Node.js', 'NodeJS']],
  ['Express.js', ['Express.js', 'ExpressJS']],
  ['REST API', ['REST API', 'REST APIs', 'RESTful']],
  ['GraphQL', ['GraphQL']],
  ['MongoDB', ['MongoDB']],
  ['SQL', ['SQL', 'MySQL', 'PostgreSQL', 'SQLite']],
  ['Firebase', ['Firebase']],
  ['Python', ['Python']],
  ['Java', ['Java']],
  ['C++', ['C++']],
  ['Django', ['Django']],
  ['Flask', ['Flask']],
  ['Git', ['Git', 'GitHub', 'GitLab']],
  ['Docker', ['Docker']],
  ['AWS', ['AWS', 'Amazon Web Services']],
  ['Azure', ['Azure']],
  ['Linux', ['Linux']],
  ['CI/CD', ['CI/CD']],
  ['Figma', ['Figma']],
  ['Machine Learning', ['Machine Learning']],
  ['Deep Learning', ['Deep Learning']],
  ['TensorFlow', ['TensorFlow']],
  ['PyTorch', ['PyTorch']],
  ['OpenCV', ['OpenCV']],
  ['Pandas', ['Pandas']],
  ['NumPy', ['NumPy']],
  ['Excel', ['MS Excel', 'Microsoft Excel', 'Advanced Excel']],
  ['Tableau', ['Tableau']],
  ['Power BI', ['Power BI']],
  ['DSA', ['DSA', 'Data Structures']],
  ['OOP', ['OOP', 'OOPS', 'Object-Oriented', 'Object Oriented']],
  ['DBMS', ['DBMS']],
  ['Kotlin', ['Kotlin']],
  ['Flutter', ['Flutter']],
]

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

const COMPILED = DEFS.map(([name, aliases, cs]) => ({
  name,
  re: new RegExp(
    `(^|[^A-Za-z0-9])(${aliases.map(esc).join('|')})(?![A-Za-z0-9])`,
    cs ? '' : 'i'
  ),
}))

export const SKILL_LIST = DEFS.map((d) => d[0])

export const extractSkills = (text = '') =>
  COMPILED.filter((c) => c.re.test(text)).map((c) => c.name)