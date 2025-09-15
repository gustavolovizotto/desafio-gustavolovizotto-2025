// Classe principal que gerencia o sistema de adoção do abrigo de animais
class AbrigoAnimais {
  // Construtor que inicializa os dados base do sistema
  constructor() {
    // Objeto que define todos os animais disponíveis com seus tipos e brinquedos favoritos na ordem correta
    this.animais = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },       // Rex é um cão que gosta de RATO depois BOLA
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },    // Mimi é um gato que gosta de BOLA depois LASER
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] }, // Fofo é um gato com 3 brinquedos em ordem
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },     // Zero é um gato que gosta de RATO depois BOLA
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },   // Bola é um cão que gosta de CAIXA depois NOVELO
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] }, // Bebe é um cão com 3 brinquedos em ordem
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }   // Loco é um jabuti com regra especial
    };
    // Array com todos os brinquedos válidos 
    this.brinquedosValidos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];
  }

  // Método principal que processa a solicitação de adoção
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const brinquedos1 = brinquedosPessoa1.split(',').map(b => b.trim());
    const brinquedos2 = brinquedosPessoa2.split(',').map(b => b.trim());
    const animaisOrdem = ordemAnimais.split(',').map(a => a.trim());

    // Executa todas as validações necessárias e retorna erro se houver algum
    const erroValidacao = this.validar(brinquedos1, brinquedos2, animaisOrdem);
    if (erroValidacao) return { erro: erroValidacao }; // Se há erro, retorna imediatamente
    
    // Inicializa array para armazenar os resultados
    const resultado = [];
    // Array para contar quantos animais cada pessoa já adotou [pessoa1, pessoa2]
    const contadores = [0, 0];

    // Processa cada animal na ordem especificada
    for (const nomeAnimal of animaisOrdem) {
      const animal = this.animais[nomeAnimal];
      const destino = this.determinarDestino(nomeAnimal, animal, [brinquedos1, brinquedos2], contadores, animaisOrdem.length > 1);
      resultado.push(`${nomeAnimal} - ${destino}`);
    }

    // Retorna a lista final ordenada alfabeticamente
    return { lista: resultado.sort() };
  }  // Método que valida se todos os dados de entrada estão corretos
  validar(brinquedos1, brinquedos2, animais) {
    // Valida os brinquedos de ambas as pessoas
    for (const lista of [brinquedos1, brinquedos2]) { 
      const unicos = new Set(); // Set para detectar brinquedos duplicados dentro da mesma lista
      for (const brinquedo of lista) { 
        // Verifica se o brinquedo é válido E se não está duplicado na mesma lista
        if (!this.brinquedosValidos.includes(brinquedo) || unicos.has(brinquedo)) {
          return 'Brinquedo inválido'; 
        }
        unicos.add(brinquedo); // Adiciona brinquedo ao set de controle de duplicados
      }
    }

    // Valida os animais solicitados
    const animaisUnicos = new Set(); 
    for (const animal of animais) { 
      // Verifica se o animal existe no sistema E se não está duplicado
      if (!this.animais[animal] || animaisUnicos.has(animal)) {
        return 'Animal inválido'; 
      }
      animaisUnicos.add(animal); // Adiciona animal ao set de controle de duplicados
    }

    return null; // Se todas validações passsaram, então retorna null
  }

  // Verifica se uma pessoa pode adotar um animal baseado na ordem dos brinquedos
  podeAdotar(brinquedosAnimal, brinquedosPessoa) {
    let indice = 0; 
    for (const brinquedo of brinquedosAnimal) { // Para cada brinquedo que o animal deseja (em ordem)
      // Procura o brinquedo na lista da pessoa, começando do índice atual
      const pos = brinquedosPessoa.indexOf(brinquedo, indice);
      if (pos === -1) return false; // Se não encontrou o brinquedo, pessoa não pode adotar
      indice = pos + 1; // Atualiza o índice para continuar a busca após este brinquedo
    }
    return true; // Se encontrou todos os brinquedos na ordem correta, pessoa pode adotar
  }

  // Determina qual pessoa pode adotar o animal ou se ele vai para o abrigo
  determinarDestino(nomeAnimal, animal, brinquedosPessoas, contadores, temOutroAnimal) {
    let podeAdotar = [false, false]; // Array indicando se pessoa1 e pessoa2 podem adotar

    // Aplicar regra especial do Loco: não se importa com ordem se tiver outro animal
    if (nomeAnimal === 'Loco' && temOutroAnimal) {
      // Para Loco, só verifica se a pessoa tem todos os brinquedos, sem considerar ordem
      podeAdotar = brinquedosPessoas.map(b => animal.brinquedos.every(br => b.includes(br)));
    } else {
      podeAdotar = brinquedosPessoas.map(b => this.podeAdotar(animal.brinquedos, b));
    }

    // 3 animais por pessoa
    podeAdotar = podeAdotar.map((pode, i) => pode && contadores[i] < 3);

    // Regra pros gatos 
    if (animal.tipo === 'gato' && podeAdotar[0] && podeAdotar[1]) {
      const brinquedosGato = new Set(animal.brinquedos);
      // Verifica se há conflito: algum brinquedo está nas duas listas E o gato quer ele
      const conflito = brinquedosPessoas[0].some(b => brinquedosPessoas[1].includes(b) && brinquedosGato.has(b));
      if (conflito) return 'abrigo'; // Se há conflito, gato vai para o abrigo *TADINHO kkkkk
    }

    // Decidir destino final baseado nas regras de prioridade
    if (podeAdotar[0] && podeAdotar[1]) return 'abrigo'; // Se ambas podem, animal fica no abrigo (pq n adotar os dois)
    if (podeAdotar[0]) { contadores[0]++; return 'pessoa 1'; } // Se só pessoa 1 pode, incrementa contador e retorna
    if (podeAdotar[1]) { contadores[1]++; return 'pessoa 2'; } // Se só pessoa 2 pode, incrementa contador e retorna
    return 'abrigo'; 
  }
}
export { AbrigoAnimais as AbrigoAnimais };
