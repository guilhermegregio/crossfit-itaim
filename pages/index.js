import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {
  Stack,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';

const CATEGORIES = [
  //Male
  { name: 'TEEN', id: 2425 },
  { name: 'ELITE', id: 2418 },
  { name: '40_44', id: 2427 },
  { name: '45_49', id: 2429 },
  { name: '50', id: 2431 },
  //Female
  { name: 'TEEN', id: 2426 },
  { name: 'ELITE', id: 2419 },
  { name: '40_44', id: 2428 },
  { name: '45_49', id: 2430 },
  { name: '50+', id: 2433 },
];

const Rank = ({ athletes, athletesM, athletesF }) => {
  const [gender, setGender] = React.useState('ALL');
  const [list, setList] = React.useState(athletes);

  React.useEffect(() => {
    if (gender === 'ALL') {
      setList(athletes);
    } else if (gender === 'M') {
      setList(athletesM);
    } else {
      setList(athletesF);
    }
  }, [gender]);

  return (
    <div className="container">
      <Head>
        <title>Rank Crossfit Itaim - TCB4ALL 2021</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ background: 'black', marginBottom: '16px', padding: '16px', width: '100%' }}>
        <Image src="/itaim-logo.png" width="160" height="147" alt="Crossfit Itaim" />
      </div>

      <Stack direction="row" spacing={4} align="center">
        <Button onClick={() => setGender('ALL')}>Todos</Button>
        <Button onClick={() => setGender('M')}>Masculino</Button>
        <Button onClick={() => setGender('F')}>Feminino</Button>
      </Stack>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Rank Geral</Th>
            <Th>Nome</Th>
            <Th>Categoria</Th>
            <Th>Footloose</Th>
            <Th>Dúzia</Th>
            <Th>The Cub Complex</Th>
          </Tr>
        </Thead>
        <Tbody>
          {list.map((athlete, index) => (
            <Tr key={athlete.name}>
              <Td>{index + 1}</Td>
              <Td>{athlete.rank || '-'}</Td>
              <Td>{athlete.name}</Td>
              <Td>{athlete.category}</Td>
              <Td>{athlete.results[0] || '-'}</Td>
              <Td>{athlete.results[1] || '-'}</Td>
              <Td>{athlete.results[2] || '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

const filterCrossfitItaim = (a) => a.team.box === 'CROSSFIT ITAIM';

const getRankByCategory = async ({ id, name }) => {
  const res = await fetch(
    `https://api.crossx.com.br/api/public/results?championship=385&competition=${id}&sub_division=0&limit=10000&page=1`,
  );

  const json = await res.json();

  const athletes = json.athletes.data.filter(filterCrossfitItaim).map((athlete) => {
    let category = name;

    if (name.includes('ELITE')) {
      category = athlete.team.name.includes('*') ? '35-39' : 'Elite';
    }

    return {
      rank: athlete.rank,
      name: athlete.team.name,
      category,
      results: athlete.results.map((r) => r.result),
      raw: JSON.stringify(athlete, null, 2),
    };
  });

  return athletes;
};

const sortProva1 = (a, b) => {
  const v1 = (a.results[0] || '1000000').replace('CAP+', '100').replace(':', '');
  const v2 = (b.results[0] || '1000000').replace('CAP+', '100').replace(':', '');

  return v1 - v2;
};

export async function getStaticProps() {
  //const teenM = await getRankByCategory(CATEGORIES[0]);
  const eliteM = await getRankByCategory(CATEGORIES[1]);
  const a40m = await getRankByCategory(CATEGORIES[2]);
  const a45m = await getRankByCategory(CATEGORIES[3]);
  //const a50m = await getRankByCategory(CATEGORIES[4]);

  //const teenF = await getRankByCategory(CATEGORIES[5]);
  const eliteF = await getRankByCategory(CATEGORIES[6]);
  const a40f = await getRankByCategory(CATEGORIES[7]);
  const a45f = await getRankByCategory(CATEGORIES[8]);
  //const a50f = await getRankByCategory(CATEGORIES[9]);

  const fabio = eliteM.find((a) => a.name === 'FABIO MARCIANO **');
  const danilo = eliteM.find((a) => a.name === 'DANILO GOMES');
  const juliana = eliteF.find((a) => a.name === 'JULIANA BITENCOURT **');
  const roberto = a45m.find((a) => a.name === 'ROBERTO COSTA');
  const leonardo = a40m.find((a) => a.name === 'LEONARDO MESQUITA DA CRUZ');

  fabio.results = ['CAP+110', ...fabio.results];
  danilo.results = ['CAP+57', ...danilo.results];
  leonardo.results = ['CAP+97', ...leonardo.results];
  juliana.results = ['CAP+170', ...juliana.results];

  const athletesM = [...eliteM, ...a40m, ...a45m].sort(sortProva1);
  const athletesF = [...eliteF, ...a40f, ...a45f].sort(sortProva1);
  const athletes = [...athletesM, ...athletesF].sort(sortProva1);

  return {
    props: {
      athletes,
      athletesM,
      athletesF,
    },
  };
}

export default Rank;
