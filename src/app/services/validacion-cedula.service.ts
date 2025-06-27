import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacionCedulaService {


  


 
  
  validadorDeCedula(cedula: string): boolean {
    let cedulaCorrecta = false;
    // Asegurar que tenga exactamente 10 dígitos (rellena con ceros si hace falta)
    cedula = cedula.trim().padStart(10, '0');
    if (cedula.length === 10) {
      let tercerDigito = parseInt(cedula.substring(2, 3));
      
      if (tercerDigito <= 6) {
        let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let verificador = parseInt(cedula.substring(9, 10));
        let suma: number = 0;
        for (let i = 0; i < 9; i++) {
          let digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
          suma += (digito % 10) + Math.floor(digito / 10);
        }
        let residuo = suma % 10;
        let resultado = residuo === 0 ? 0 : 10 - residuo;
        if (resultado === verificador) {
          cedulaCorrecta = true;
        }
      }
    }
  
    return cedulaCorrecta;
  }
    
  
  //  validadorDeCedula(cedula: string): boolean {
  //   let cedulaCorrecta = false;
  //    if (cedula.length == 10) {
  //     let tercerDigito = parseInt(cedula.substring(2, 3));
  //     if (tercerDigito < 6) {
  //       let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  //       let verificador = parseInt(cedula.substring(9, 10));
  //       let suma: number = 0;
  //       let digito: number = 0;
  //       console.log(tercerDigito)
  //       for (let i = 0; i < (cedula.length - 1); i++) {
  //         digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
  //         suma += ((parseInt((digito % 10) + '') + (parseInt((digito / 10) + ''))));
  //       }
  //       suma = Math.round(suma);
  //       if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10) == verificador)) {
  //         cedulaCorrecta = true;
  //       } else if ((10 - (Math.round(suma % 10))) == verificador) {
  //         cedulaCorrecta = true;
  //       } else {
  //         cedulaCorrecta = false;
  //       }
  //     } else {
  //       cedulaCorrecta = false;
  //     }
  //   } else {
  //     cedulaCorrecta = false;
  //   }
  //   return cedulaCorrecta;
  // }

  validarRuc(ruc: string): boolean {
    const noTieneTreceDigitos = ruc.length !== 13;
    if (noTieneTreceDigitos) {
      return false;
    }
    const noTieneCeroCeroUnoAlFinal = !(ruc.substring(10) === '001');
    if (noTieneCeroCeroUnoAlFinal) {
      return false;
    }
    return this.validarDigitoVerificador(ruc);
  }

  private validarDigitoVerificador(ruc: string): boolean {
    const diezDigitosIniciales = ruc.substring(0, 10);
    const tercerDigito = Number(ruc.substring(2, 3));
    switch (tercerDigito) {
      case 6:
        return this.validarTercerDigitoSeis(diezDigitosIniciales);
      case 9:
        return this.validaTercerDigitoNueve(diezDigitosIniciales);
      default:
        return this.validadorDeCedula(diezDigitosIniciales);
    }
  }

  private validarTercerDigitoSeis(diezDigitosIniciales: string) {
    const digitoUno = Number(diezDigitosIniciales.substring(0, 1));
    const digitoUnoMultiplicado = digitoUno * 3;
    const digitoDos = Number(diezDigitosIniciales.substring(1, 2));
    const digitoDosMultiplicado = digitoDos * 2;
    const digitoTres = Number(diezDigitosIniciales.substring(2, 3));
    const digitoTresMultiplicado = digitoTres * 7;
    const digitoCuatro = Number(diezDigitosIniciales.substring(3, 4));
    const digitoCuatroMultiplicado = digitoCuatro * 6;
    const digitoCinco = Number(diezDigitosIniciales.substring(4, 5));
    const digitoCincoMultiplicado = digitoCinco * 5;
    const digitoSeis = Number(diezDigitosIniciales.substring(5, 6));
    const digitoSeisMultiplicado = digitoSeis * 4;
    const digitoSiete = Number(diezDigitosIniciales.substring(6, 7));
    const digitoSieteMultiplicado = digitoSiete * 3;
    const digitoOcho = Number(diezDigitosIniciales.substring(7, 8));
    const digitoOchoMultiplicado = digitoOcho * 2;
    const digitoNueve = Number(diezDigitosIniciales.substring(8, 9));


    const digitoUnoMultiplicadoYSumado = this.sumaDigito(digitoUnoMultiplicado);
    const digitoDosMultiplicadoYSumado = this.sumaDigito(digitoDosMultiplicado);
    const digitoTresMultiplicadoYSumado = this.sumaDigito(digitoTresMultiplicado);
    const digitoCuatroMultiplicadoYSumado = this.sumaDigito(digitoCuatroMultiplicado);
    const digitoCincoMultiplicadoYSumado = this.sumaDigito(digitoCincoMultiplicado);
    const digitoSeisMultiplicadoYSumado = this.sumaDigito(digitoSeisMultiplicado);
    const digitoSieteMultiplicadoYSumado = this.sumaDigito(digitoSieteMultiplicado);
    const digitoOchoMultiplicadoYSumado = this.sumaDigito(digitoOchoMultiplicado);
    const sumaDePersonasNaturales = digitoUnoMultiplicadoYSumado + digitoDosMultiplicadoYSumado + digitoTresMultiplicadoYSumado
      + digitoCuatroMultiplicadoYSumado + digitoCincoMultiplicadoYSumado + digitoSeisMultiplicadoYSumado
      + digitoSieteMultiplicadoYSumado + digitoOchoMultiplicadoYSumado;
    const sumaDeSociedades = digitoUno + digitoDos + digitoTres + digitoCuatro + digitoCinco + digitoSeis + digitoSiete + digitoOcho;

    let verificadorDePersonasNaturales = 11 - (sumaDePersonasNaturales % 11);
    const verificadorDeSociedades = 11 - (sumaDeSociedades % 11);
    const verificadoresIgualAOnce = verificadorDePersonasNaturales === 11 || verificadorDeSociedades === 11
    if (verificadoresIgualAOnce) {
      verificadorDePersonasNaturales = 0;
    }
    if (verificadorDePersonasNaturales === digitoNueve || verificadorDeSociedades === digitoNueve) {
      return true;
    } else {
      return this.validadorDeCedula(diezDigitosIniciales);
    }
  }

  private validaTercerDigitoNueve(diezDigitosIniciales: string): boolean {
    const digitoUno = Number(diezDigitosIniciales.substring(0, 1));
    const digitoUnoMultiplicado = digitoUno * 4;
    const digitoDos = Number(diezDigitosIniciales.substring(1, 2));
    const digitoDosMultiplicado = digitoDos * 3;
    const digitoTres = Number(diezDigitosIniciales.substring(2, 3));
    const digitoTresMultiplicado = digitoTres * 2;
    const digitoCuatro = Number(diezDigitosIniciales.substring(3, 4));
    const digitoCuatroMultiplicado = digitoCuatro * 7;
    const digitoCinco = Number(diezDigitosIniciales.substring(4, 5));
    const digitoCincoMultiplicado = digitoCinco * 6;
    const digitoSeis = Number(diezDigitosIniciales.substring(5, 6));
    const digitoSeisMultiplicado = digitoSeis * 5;
    const digitoSiete = Number(diezDigitosIniciales.substring(6, 7));
    const digitoSieteMultiplicado = digitoSiete * 4;
    const digitoOcho = Number(diezDigitosIniciales.substring(7, 8));
    const digitoOchoMultiplicado = digitoOcho * 3;
    const digitoNueve = Number(diezDigitosIniciales.substring(8, 9));
    const digitoNueveMultiplicado = digitoNueve * 2;
    const digitoDiez = Number(diezDigitosIniciales.substring(9));

    const sumaDigitosMultiplicados = digitoUnoMultiplicado + digitoDosMultiplicado + digitoTresMultiplicado
      + digitoCuatroMultiplicado + digitoCincoMultiplicado + digitoSeisMultiplicado + digitoSieteMultiplicado
      + digitoOchoMultiplicado + digitoNueveMultiplicado;

    let verificador = 11 - (sumaDigitosMultiplicados % 11);
    if (verificador === 11) {
      verificador = 0;
    }

    if (verificador === 10) {
      return false;
    } else if (verificador === digitoDiez) {
      return true;
    }
    return false;
  }

  private sumaDigito(digito: number) {
    let sumaDigitos = digito;
    let valorUno = 0;
    let valorDos = 0;
    if (digito > 9) {
      valorUno = Number(digito.toString().substring(0, 1));
      valorDos = Number(digito.toString().substring(1, 2));
      sumaDigitos = valorUno + valorDos;
      if (sumaDigitos > 9) {
        sumaDigitos = this.sumaDigito(sumaDigitos);
      }
    }
    return sumaDigitos;
  }
}
