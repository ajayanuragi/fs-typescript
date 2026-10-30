const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <div>
      <Header courseName={courseName} />
      {courseParts.map((part, index) => (
        <Content
          name={part.name}
          exerciseCount={part.exerciseCount}
          key={index}
        />
      ))}
      <Total totalExercises={totalExercises} />
    </div>
  );
};

interface TotalProps {
  totalExercises: number;
}

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

interface ContentProps {
  name: string;
  exerciseCount: number;
}

const Content = (props: ContentProps) => {
  return (
    <p>
      {props.name} {props.exerciseCount}
    </p>
  );
};

interface HeaderProps {
  courseName: string;
}

const Header = (props: HeaderProps) => {
  return <h1> {props.courseName}</h1>;
};
export default App;
