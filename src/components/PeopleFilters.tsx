import { useSearchParams } from 'react-router-dom';

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const centuries = searchParams.getAll('centuries');

  const handleQueryChange = e => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set('query', value);
    } else {
      newParams.delete('query');
    }

    setSearchParams(newParams);
  }; // <-- faltando isso aqui!

  const handleCenturyClick = century => {
    const newCenturies = centuries.includes(century)
      ? centuries.filter(c => c !== century)
      : [...centuries, century];
    const newParams = new URLSearchParams(searchParams);

    if (newCenturies.length > 0) {
      newParams.set('centuries', newCenturies);
    } else {
      newParams.delete('centuries');
    }

    setSearchParams(newParams);
  };

  return (
    <input
      data-cy="NameFilter"
      type="search"
      className="input"
      placeholder="Search"
      value={query}
      onChange={handleQueryChange}
    />
    // ...
  );
};

