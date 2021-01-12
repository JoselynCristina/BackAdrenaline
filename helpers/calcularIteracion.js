// datos de entrada
/*
let intervaloDias = 5
let cantidadConsultas = 6
let cantidadMedicos = 3
let cantidadPacientes = 15
let atencionDiaria = 4
*/
let intervaloDias = 3
let cantidadConsultas = 6
let cantidadMedicos = 2
let cantidadPacientes = 10
let atencionDiaria = 2

// proceso:

//calcular tamaño de arreglo de atenciones:
let tamArray = cantidadPacientes / (cantidadMedicos * atencionDiaria)
let moduloTam = cantidadPacientes%(cantidadMedicos*atencionDiaria)
let arrayAtenciones = []
if ( moduloTam > 0) {
  console.log('irregular')
  console.log({
    tamArray,
    moduloTam
  })
  arrayAtenciones = []
  arrayAtenciones.length = Math.floor(tamArray) + 1
  console.log(arrayAtenciones.length)
} else {
  console.log('normal')
  arrayAtenciones = [tamArray]
}

// llenar arrayAtenciones
let arrayDiasAtencion

console.log({intervaloDias, cantidadConsultas, cantidadMedicos, cantidadPacientes, atencionDiaria})
 
for (let i = 0; i < arrayAtenciones.length; i++) {
  arrayDiasAtencion = []
  let diaInicio = i+1
  let diaToca = 0
  for (let j = 0; j < cantidadConsultas; j++) {
    diaToca = diaInicio + j*intervaloDias 
    // console.log('push--->>>>>> ', diaToca)
    arrayDiasAtencion.push(diaToca)
  }
  arrayAtenciones[i] = arrayDiasAtencion
  /*
  if (i > 0) {
    // verificar si hay algun cruce con un registro previo
    console.log('verificando cruce')
  }*/
}

// mostrar
for (let data1 = 0; data1 < arrayAtenciones.length; data1++) {
  for (let data2 = 0; data2 < arrayDiasAtencion.length; data2++) {
    console.log(`[Data-${data1}]--->>> {${arrayAtenciones[data1][data2]}}`)
  }
  console.log('-------------------------------------')
}

console.log(arrayAtenciones[arrayAtenciones.length-1][arrayDiasAtencion.length-1])
