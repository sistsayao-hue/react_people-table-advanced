import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelectPerson: (person: Person) => void;
};

export const PeopleTable = ({
  people,
  selectedPerson,
  onSelectPerson,
}: Props) => {
  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => (
          <tr
            data-cy="person"
            key={person.slug}
            className={
              selectedPerson?.slug === person.slug
                ? 'has-background-warning'
                : ''
            }
            onClick={() => onSelectPerson(person)}
          >
            <td>
              <a
                className={
                  person.sex === 'f' ? 'has-text-danger' : 'has-text-link'
                }
                href={`#/people/${person.slug}`}
              >
                {person.name}
              </a>
            </td>

            <td>{person.sex}</td>

            <td>{person.born}</td>

            <td>{person.died}</td>

            <td>
              {person.mother ? (
                <a
                  className="has-text-danger"
                  href={`#/people/${person.mother.slug}`}
                >
                  {person.mother.name}
                </a>
              ) : person.motherName ? (
                <a
                  className="has-text-danger"
                  href={`#/people/${person.motherSlug}`}
                >
                  {person.motherName}
                </a>
              ) : (
                '-'
              )}
            </td>

            <td>
              {person.father ? (
                <a
                  className="has-text-link"
                  href={`#/people/${person.father.slug}`}
                >
                  {person.father.name}
                </a>
              ) : person.fatherName ? (
                <a
                  className="has-text-link"
                  href={`#/people/${person.fatherSlug}`}
                >
                  {person.fatherName}
                </a>
              ) : (
                '-'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

