function genrateRandomNum (min, max)
{
    return Math.floor ((Math.random() * (max - min)) + min);
}

export default genrateRandomNum;