const db = require("./db");
const { Movie, Person } = db.models;
const { Op } = db.Sequelize;

(async () => {
  await db.sequelize.sync({ force: true });

  try {
    const moviex = await Movie.create({
      title: "Angels",
      runtime: 103,
      releaseDate: "1900-01-01",
      isAvailableOnVHS: false,
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
        runtime: 115,
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

    const movies6 = await Movie.findAll({
      attributes: ["id", "title"], // return only the id and title columns
      where: {
        releaseDate: {
          [Op.gte]: "1990-01-01", // changed from 2004 so Toy Story (1995) can pass this check
        },
        runtime: {
          [Op.between]: [75, 115], // keep only ONE runtime rule; 75 to 115 minutes
        },
        title: {
          [Op.endsWith]: "story", // title must end with "story"
        },
      },
    });
    console.log(movies6.map((movie) => movie.toJSON())); // should show Toy Story
    const movies5 = await Movie.findAll({
      attributes: ["id", "title"],
      where: {
        title: {
          [Op.endsWith]: "story",
        },
      },
      order: [["id", "DESC"]], // IDs in descending order
    });
    console.log(movies5.map((movie) => movie.toJSON()));

    // const toyStory3 = await Movie.findByPk(4); // id 4 is Toy Story 3 (renamed "Updated Title"), not 3
    // toyStory3.isAvailableOnVHS = true; // changes the value in memory only
    // await toyStory3.save(); // saves the change to the database
    // console.log(toyStory3.get({ plain: true })); // prints the saved movie as a plain object

    // const angels = await Movie.findByPk(1); // id 1 is Angels
    // await angels.update({
    //   // update changes the value and saves it in one step
    //   isAvailableOnVHS: true, // Angels was created as false, so this will be a real change
    // });
    // console.log(angels.get({ plain: true })); // prints the updated Angels

    // const toyStory3 = await Movie.findByPk(3);
    // await toyStory3.update(
    //   {
    //     title: "Trinket Tale 3", // new title
    //     isAvailableOnVHS: true,
    //   },
    //   {}
    // );

    // console.log(toyStory3.get({ plain: true }));

    const toyStory3 = await Movie.findByPk(3);
    await toyStory3.update(
      {
        title: "Trinket Tale 3", // this will be ignored
        isAvailableOnVHS: true,
      },
      { fields: ["title", "isAvailableOnVHS"] }
    );

    console.log(toyStory3.get({ plain: true }));

    const toyStory = await Movie.findByPk(1); // finds the movie with id 1 (that's Angels in your data)
    await toyStory.destroy(); // deletes that movie from the database

    const allMovies = await Movie.findAll(); // gets every movie that is left
    console.log(allMovies.map((movie) => movie.toJSON())); // prints them, and the deleted movie should be missing
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errors = error.errors.map((err) => err.message);
      console.error("Validation errors: ", errors);
    } else {
      throw error;
    }
  }
})();
