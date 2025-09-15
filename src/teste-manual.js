import { AbrigoAnimais } from "./abrigo-animais.js";

const abrigo = new AbrigoAnimais();

console.log("=== Testes do Abrigo de Animais ===\n");

const testes = [
  {
    nome: "Animal inválido",
    entrada: ['CAIXA,RATO', 'RATO,BOLA', 'Lulu'],
    esperado: "{ erro: 'Animal inválido' }"
  },
  {
    nome: "Caso básico",
    entrada: ['RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'],
    esperado: "['Fofo - abrigo', 'Rex - pessoa 1']"
  },
  {
    nome: "Intercalando brinquedos",
    entrada: ['BOLA,LASER', 'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola'],
    esperado: "['Bola - abrigo', 'Fofo - pessoa 2', 'Mimi - abrigo', 'Rex - abrigo']"
  },
  {
    nome: "Regra do Loco",
    entrada: ['SKATE,RATO', 'BOLA', 'Loco,Rex'],
    esperado: "Loco com outro animal"
  },
  {
    nome: "Brinquedo inválido",
    entrada: ['BOLA,XPTO', 'RATO', 'Rex'],
    esperado: "{ erro: 'Brinquedo inválido' }"
  }
];

testes.forEach((teste, i) => {
  console.log(`${i + 1}. ${teste.nome}:`);
  const resultado = abrigo.encontraPessoas(...teste.entrada);
  console.log(resultado);
  console.log(`Esperado: ${teste.esperado}\n`);
});