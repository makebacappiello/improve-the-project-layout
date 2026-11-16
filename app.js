const db = require("./db");
const { Movie, Person } = db.models;

(async () => {
  await db.sequelize.sync({ force: true });

  try {
    const moviex = await Movie.create({
      title: "Angels",
      runtime: 81,
      releaseDate: "1900-01-01",
      isAvailableOnVHS: true,
    });
    // console.log(moviex.toJSON());

    const movie = await Movie.create({
      title: "Toy Story",
      runtime: 81,
      releaseDate: "1995-11-22",
      isAvailableOnVHS: true,
    });
    // console.log(movie.toJSON());

    const movie2 = await Movie.create({
      title: "The Incredibles",
      runtime: 115,
      releaseDate: "2004-04-14",
      isAvailableOnVHS: true,
    });
    // console.log(movie2.toJSON());

    // New instance
    const movie3 = await Movie.build({
      title: "Toy Story 3",
      runtime: 103,
      releaseDate: "2010-06-18",
      // isAvailableOnVHS: false,
    });
    movie3.title = "Updated Title";
    await movie3.save(); // save the record
    // title: 'Updated Title' is stored in the database
    // console.log(movie3.toJSON());

    const person = await Person.create({
      firstName: "Makeba",
      lastName: "Misty",
    }); // person is stored in database
    // console.log(person.toJSON());

    const person2 = await Person.build({
      firstName: "Brad",
      lastName: "Bird",
    }); // person2 is not stored in the database yet
    await person2.save(); // person2 is now stored in the database

    const movieById = await Movie.findByPk(1);
    console.log(movieById.toJSON());

    const movieByRuntime = await Movie.findOne({ where: { runtime: 115 } });
    console.log(movieByRuntime.toJSON());

    const personByLastname = await Person.findOne({
      where: { lastName: "Misty" },
    });

    const personById = await Person.findByPk(100);

    const movies = await Movie.findAll({
      where: {
        runtime: 92,
        isAvailableOnVHS: true,
      },
    });
    // SELECT * FROM Movies WHERE runtime = 92 AND isAvailableOnVHS = true;

    console.log(movies.map((movie) => movie.toJSON()));

    const otherMovies = await Movie.findAll({
      attributes: ["id", "title"], // return only id and title
      where: {
        isAvailableOnVHS: true,
      },
    });
    console.log(otherMovies.map((movie) => movie.toJSON()));
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message);
      console.error("Validation errors: ", errors);
    } else {
      throw error;
    }
  }
})();
