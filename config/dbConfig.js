// module.exports ={
//     HOST:'localhost',
//     USER:"root",
//     PASSWORD:"",
//     DB:"dryexpressbd",
//     dialect:'mysql',

//     pool:{
//         max:5,
//         min:0,
//         acquire:30000,
//         idle:10000
//     }


// }

module.exports ={
    HOST:'localhost',
    USER:"root",
    PASSWORD:"rootpassword",
    DB:"dryexpress_local",
    dialect:'mysql',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000,
        evict:1000
    }


}