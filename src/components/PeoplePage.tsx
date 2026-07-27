import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PeopleFilters } from './PeopleFilters';
import { Loader } from './Loader';
import { PeopleTable } from './PeopleTable';
import { getPeople } from '../api';

import { Person } from '../types/Person';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('query') || '';
  const centuries = searchParams.getAll('centuries');

  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  useEffect(() => {
    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams);

    if (sort !== field) {
      params.delete('sort');
      params.delete('order');

      params.append('sort', field);
      params.append('order', 'asc');

      setSearchParams(params);

      return;
    }

    if (order === 'asc') {
      params.delete('order');
      params.append('order', 'desc');

      setSearchParams(params);

      return;
    }

    params.delete('sort');
    params.delete('order');

    setSearchParams(params);
  };

  const filteredPeople = people.filter(person => {
    const search = query.toLowerCase();

    const matchesQuery =
      person.name.toLowerCase().includes(search) ||
      person.motherName?.toLowerCase().includes(search) ||
      person.fatherName?.toLowerCase().includes(search) ||
      person.mother?.name?.toLowerCase().includes(search) ||
      person.father?.name?.toLowerCase().includes(search);

    const matchesCentury =
      centuries.length === 0 ||
      centuries.some(
        century => Math.ceil(person.born / 100) === Number(century),
      );

    return matchesQuery && matchesCentury;
  });

  const sortedPeople = [...filteredPeople].sort((a, b) => {
    if (!sort) {
      return 0;
    }

    switch (sort) {
      case 'name':
        return order === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);

      case 'sex':
        return order === 'desc'
          ? b.sex.localeCompare(a.sex)
          : a.sex.localeCompare(b.sex);

      case 'born':
        return order === 'desc'
          ? b.born - a.born
          : a.born - b.born;

      case 'died':
        return order === 'desc'
          ? b.died - a.died
          : a.died - b.died;

      default:
        return 0;
    }
  });

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            <PeopleFilters />
          </div>

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}

              {error && (
                <p data-cy="peopleLoadingError">
                  Something went wrong
                </p>
              )}

              {!loading && !error && sortedPeople.length === 0 && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}

              {!loading && !error && sortedPeople.length > 0 && (
                <PeopleTable
                  people={sortedPeople}
                  selectedPerson={selectedPerson}
                  onSelectPerson={setSelectedPerson}
                  sort={sort || ''}
                  order={order || ''}
                  onSort={handleSort}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
