const getXiMark = (workerPerformance: number, interectionPerformanceWithPM: number): number => {
  const upPart = workerPerformance*(1 - interectionPerformanceWithPM);
  const downPart = upPart + interectionPerformanceWithPM*(1 - workerPerformance);

  return upPart/downPart;
}


const getXiStar = (xiMark: number, managerPerformance: number): number => {
  const ximarkMultiplyOneMinusManagerP = xiMark*(1 - managerPerformance);
  const managerPMultiplyOneMinusZimark = managerPerformance*(1 - xiMark);
  const firstPart = ximarkMultiplyOneMinusManagerP/managerPMultiplyOneMinusZimark;
  const secondPart = managerPMultiplyOneMinusZimark/ximarkMultiplyOneMinusManagerP;

  const sqrtPart = Math.sqrt(firstPart + secondPart - 2);

  return xiMark >= 0.5 ? 0.5 * sqrtPart : -0.5 * sqrtPart;
}

const getR0 = (xStarArray: number[]): number => {
  const xStarSum = xStarArray.reduce((acc, val) => { return acc + val; }, 0);

  return 0.5 + (xStarSum / (2 * Math.sqrt(xStarSum ** 2 + 1)));
}

const getPerformance = (R0: number, PMPerformance: number): number => {
  return (R0 * PMPerformance) / (R0 * PMPerformance + ((1 - R0) * (1 - PMPerformance)));
}

const calculateTeamPerformance = (PMPerformance: number, workersPerformances: { workerPerformance: number, interactionPerformanceWithPM: number }[]): number => {

  const ximarks: number[] = workersPerformances.map((workersPerformance) => {
    return getXiMark(workersPerformance.workerPerformance, workersPerformance.interactionPerformanceWithPM);
  })

  const xistars: number[] = ximarks.map(ximark => {
    return getXiStar(ximark, PMPerformance);
  })

  const ro = getR0(xistars);

  return getPerformance(ro, PMPerformance);
}

const getDistinctValuesCombinations = <T>(values: T[]): T[][] => {
  const combinations: T[][] = [];

  if (values.length < 3) {
    combinations.push([values[0], values[1]]);
    combinations.push([values[1], values[0]])

    return combinations;
  }

  values.forEach((value: T, index: number) => {
    const newCombinations: T[][] = [];

    const valuesWithoutVal = values.filter((valueToCheck: T, indexValueToCheck: number) => {
      return index !== indexValueToCheck;
    });

    const combinationsWithoutValues = getDistinctValuesCombinations(valuesWithoutVal);

    combinationsWithoutValues.forEach((combinationWithoutValues: T[]) => {
      newCombinations.push([value, ...combinationWithoutValues]);
    })

    combinations.push(...newCombinations);
  });

  return combinations;
}

type ProjectManagerPerformance = {
  individual: number;
  interaction: number[]
}

type PerformanceValues = {
  projectManagerPerformances: ProjectManagerPerformance[];
  workerPerformances: number[];
};
const getBestTeamCombination = (teamMembers: PerformanceValues): number[] => {

  const countTeamMembers = teamMembers.workerPerformances.length;
  let error = teamMembers.projectManagerPerformances.length !== countTeamMembers;
  teamMembers.projectManagerPerformances.forEach(projectManagerPerformance => {
    if (projectManagerPerformance.interaction.length !== countTeamMembers) {
      error = true;
    }
  })

  if (error) {
    throw new Error('Not valid teamMembers data');
  }

  const indexesArray = Array.from({ length: countTeamMembers }, (value, index) => index);
  const combinations = getDistinctValuesCombinations(indexesArray);

  let bestPerformance = 0;
  let bestCombination: number[] = [];
  combinations.forEach((combination: number[]) => {
    let performance = 0;

    combination.forEach((index: number) => {
      const pmPerformance = calculateTeamPerformance(teamMembers.projectManagerPerformances[index].individual, [
        {
          workerPerformance: teamMembers.workerPerformances[index],
          interactionPerformanceWithPM: teamMembers.projectManagerPerformances[index].interaction[index],
        },
      ]);

      performance += pmPerformance;
    })

    if (performance > bestPerformance) {
      bestCombination = combination;
      bestPerformance = performance;
    }
  })

  return bestCombination;
}


const projectManager1Performance = 0.58;
const projectManager2Performance = 0.82;
const projectManager3Performance = 0.46;
const projectManager4Performance = 0.85

const lawyer1Performance = 0.75;
const lawyer2Performance = 0.41;
const lawyer3Performance = 0.53;
const lawyer4Performance = 0.87;

const economist1Performance = 0.58;
const economist2Performance = 0.82;
const economist3Performance = 0.46;
const economist4Performance = 0.85;

const engineer1Performance = 0.65;
const engineer2Performance = 0.29;
const engineer3Performance = 0.43;
const engineer4Performance = 0.77;

const programmer1Performance = 0.6;
const programmer2Performance = 0.36;
const programmer3Performance = 0.58;
const programmer4Performance = 0.92;

const lawyersInteractionsData = {
  workerPerformances: [lawyer1Performance, lawyer2Performance, lawyer3Performance, lawyer4Performance],
  projectManagerPerformances:[
    {
      individual: projectManager1Performance,
      interaction: [0.8,0.3,0.2,0.5],
    },
    {
      individual: projectManager2Performance,
      interaction: [0.9,0.6,0.4,0.6],
    },
    {
      individual: projectManager3Performance,
      interaction: [0.3,0.3,0.7,0.7],
    },
    {
      individual: projectManager4Performance,
      interaction: [0.7,0.7,0.2,0.3],
    }
  ],
}

const economistsInteractionsData = {
  workerPerformances: [economist1Performance, economist2Performance, economist3Performance, economist4Performance],
  projectManagerPerformances:[
    {
      individual: projectManager1Performance,
      interaction: [0.1,0.6,0.6,0.3],
    },
    {
      individual: projectManager2Performance,
      interaction: [0.8,0.2,0.2,0.5],
    },
    {
      individual: projectManager3Performance,
      interaction: [0.5,0.5,0.3,0.7],
    },
    {
      individual: projectManager4Performance,
      interaction: [0.4,0.6,0.5,0.6],
    }
  ],
}

const engineersInteractionsData = {
  workerPerformances: [engineer1Performance, engineer2Performance, engineer3Performance, engineer4Performance],
  projectManagerPerformances:[
    {
      individual: projectManager1Performance,
      interaction: [0.1,0.6,0.6,0.3],
    },
    {
      individual: projectManager2Performance,
      interaction: [0.8,0.2,0.2,0.5],
    },
    {
      individual: projectManager3Performance,
      interaction: [0.5,0.5,0.3,0.7],
    },
    {
      individual: projectManager4Performance,
      interaction: [0.4,0.6,0.5,0.6],
    }
  ],
}

const programmersInteractionsData = {
  workerPerformances: [programmer1Performance, programmer2Performance, programmer3Performance, programmer4Performance],
  projectManagerPerformances:[
    {
      individual: projectManager1Performance,
      interaction: [0.5,0.5,0.6,0.7],
    },
    {
      individual: projectManager2Performance,
      interaction: [0.4,0.6,0.6,0.2],
    },
    {
      individual: projectManager3Performance,
      interaction: [0.3,0.6,0.4,0.3],
    },
    {
      individual: projectManager4Performance,
      interaction: [0.2,0.5,0.4,0.5],
    }
  ],
}

const bestPMLawyersTeamCombinations = getBestTeamCombination(lawyersInteractionsData);
console.log('Lawyers Best Combinations: ', bestPMLawyersTeamCombinations);
const bestPMEconomistsTeamCombinations = getBestTeamCombination(economistsInteractionsData);
console.log('Economists Best Combinations: ', bestPMEconomistsTeamCombinations);
const bestPMEngineersTeamCombinations = getBestTeamCombination(engineersInteractionsData);
console.log('Engineers Best Combinations: ', bestPMEngineersTeamCombinations);
const bestPMProgrammersTeamCombinations = getBestTeamCombination(programmersInteractionsData);
console.log('Programmers Best Combinations: ', bestPMProgrammersTeamCombinations);

const team1Performance = calculateTeamPerformance(lawyersInteractionsData.projectManagerPerformances[0].individual, [
  {
    workerPerformance: lawyersInteractionsData.workerPerformances[bestPMLawyersTeamCombinations[0]],
    interactionPerformanceWithPM: lawyersInteractionsData.projectManagerPerformances[0].interaction[bestPMLawyersTeamCombinations[0]],
  },
  {
    workerPerformance: economistsInteractionsData.workerPerformances[bestPMEconomistsTeamCombinations[0]],
    interactionPerformanceWithPM: economistsInteractionsData.projectManagerPerformances[0].interaction[bestPMEconomistsTeamCombinations[0]],
  },
  {
    workerPerformance: engineersInteractionsData.workerPerformances[bestPMEngineersTeamCombinations[0]],
    interactionPerformanceWithPM: engineersInteractionsData.projectManagerPerformances[0].interaction[bestPMEngineersTeamCombinations[0]],
  },
  {
    workerPerformance: programmersInteractionsData.workerPerformances[bestPMProgrammersTeamCombinations[0]],
    interactionPerformanceWithPM: programmersInteractionsData.projectManagerPerformances[0].interaction[bestPMProgrammersTeamCombinations[0]],
  },
]);

const team2Performance = calculateTeamPerformance(lawyersInteractionsData.projectManagerPerformances[1].individual, [
  {
    workerPerformance: lawyersInteractionsData.workerPerformances[bestPMLawyersTeamCombinations[1]],
    interactionPerformanceWithPM: lawyersInteractionsData.projectManagerPerformances[1].interaction[bestPMLawyersTeamCombinations[1]],
  },
  {
    workerPerformance: economistsInteractionsData.workerPerformances[bestPMEconomistsTeamCombinations[1]],
    interactionPerformanceWithPM: economistsInteractionsData.projectManagerPerformances[1].interaction[bestPMEconomistsTeamCombinations[1]],
  },
  {
    workerPerformance: engineersInteractionsData.workerPerformances[bestPMEngineersTeamCombinations[1]],
    interactionPerformanceWithPM: engineersInteractionsData.projectManagerPerformances[1].interaction[bestPMEngineersTeamCombinations[1]],
  },
  {
    workerPerformance: programmersInteractionsData.workerPerformances[bestPMProgrammersTeamCombinations[1]],
    interactionPerformanceWithPM: programmersInteractionsData.projectManagerPerformances[1].interaction[bestPMProgrammersTeamCombinations[1]],
  },
]);

const team3Performance = calculateTeamPerformance(lawyersInteractionsData.projectManagerPerformances[2].individual, [
  {
    workerPerformance: lawyersInteractionsData.workerPerformances[bestPMLawyersTeamCombinations[2]],
    interactionPerformanceWithPM: lawyersInteractionsData.projectManagerPerformances[2].interaction[bestPMLawyersTeamCombinations[2]],
  },
  {
    workerPerformance: economistsInteractionsData.workerPerformances[bestPMEconomistsTeamCombinations[2]],
    interactionPerformanceWithPM: economistsInteractionsData.projectManagerPerformances[2].interaction[bestPMEconomistsTeamCombinations[2]],
  },
  {
    workerPerformance: engineersInteractionsData.workerPerformances[bestPMEngineersTeamCombinations[2]],
    interactionPerformanceWithPM: engineersInteractionsData.projectManagerPerformances[2].interaction[bestPMEngineersTeamCombinations[2]],
  },
  {
    workerPerformance: programmersInteractionsData.workerPerformances[bestPMProgrammersTeamCombinations[2]],
    interactionPerformanceWithPM: programmersInteractionsData.projectManagerPerformances[2].interaction[bestPMProgrammersTeamCombinations[2]],
  },
]);

const team4Performance = calculateTeamPerformance(lawyersInteractionsData.projectManagerPerformances[3].individual, [
  {
    workerPerformance: lawyersInteractionsData.workerPerformances[bestPMLawyersTeamCombinations[3]],
    interactionPerformanceWithPM: lawyersInteractionsData.projectManagerPerformances[3].interaction[bestPMLawyersTeamCombinations[3]],
  },
  {
    workerPerformance: economistsInteractionsData.workerPerformances[bestPMEconomistsTeamCombinations[3]],
    interactionPerformanceWithPM: economistsInteractionsData.projectManagerPerformances[3].interaction[bestPMEconomistsTeamCombinations[3]],
  },
  {
    workerPerformance: engineersInteractionsData.workerPerformances[bestPMEngineersTeamCombinations[3]],
    interactionPerformanceWithPM: engineersInteractionsData.projectManagerPerformances[3].interaction[bestPMEngineersTeamCombinations[3]],
  },
  {
    workerPerformance: programmersInteractionsData.workerPerformances[bestPMProgrammersTeamCombinations[3]],
    interactionPerformanceWithPM: programmersInteractionsData.projectManagerPerformances[3].interaction[bestPMProgrammersTeamCombinations[3]],
  },
]);

console.log('team1Performance: ', team1Performance);
console.log('team2Performance: ', team2Performance);
console.log('team3Performance: ', team3Performance);
console.log('team4Performance: ', team4Performance);
