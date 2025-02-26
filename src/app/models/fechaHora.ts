export class Fechac {

    public static verificarHora(): boolean {
        var date: Date = new Date();
        var hora = date.getHours() + '';
        if (hora >= '8' || hora < '17') {
            return true;
        } else {
            return false;
        }
    }

    public static numeroDia(): number {
        var date: Date = new Date();
        var numeroDia = date.getDay();
        return numeroDia
    }

    public static nombreDia(): string {
        var date: Date = new Date();
        var numeroDia = date.getDay();
        const dias = [
            'domingo',
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado',
        ];
        return dias[numeroDia];
    }

    public static generarNombreDia(dia: number): string {
        const dias = [
            'domingo',
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado',
        ];
        return dias[dia];
    }

    public static dia(): string[] {
        var date: Date = new Date();
        var dia = date.getDate();
        var numeroDia = date.getDay();
        var mes = date.getMonth() + 1;
        const dias = [
            'domingo',
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado',
        ];
        return [dia + '', dias[numeroDia], mes + ''];
    }

    public static ultimoDiadelmes(): number {
        var date: Date = new Date();
        var ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return ultimoDia.getDate();
    }

    public static obtenerDiaDelMesMaIncremento(incremento: number): string[] {
        var date: Date = new Date();
        var ultimoDia = new Date(date.getFullYear(), date.getMonth(), date.getDate() + incremento);
        var numeroDia = ultimoDia.getDay();
        const dias = [
            'domingo',
            'lunes',
            'martes',
            'miércoles',
            'jueves',
            'viernes',
            'sábado',
        ];
        const meses = [
            'enero',
            'febrero',
            'marzo',
            'abril',
            'mayo',
            'junio',
            'julio',
            'agosto',
            'septiembre',
            'octubre',
            'noviembre',
            'diciembre'
        ];
        return [ultimoDia.getDate() + '', dias[numeroDia], meses[ultimoDia.getMonth()], ultimoDia.getFullYear() + ''];
    }

    public static transformarDeMesAhNumero(mes: string): string {
        var numeroMes = '';
        if (mes == 'enero') {
            numeroMes = '01';
        } else if (mes == 'febrero') {
            numeroMes = '02';
        } else if (mes == 'marzo') {
            numeroMes = '03';
        } else if (mes == 'abril') {
            numeroMes = '04';
        } else if (mes == 'mayo') {
            numeroMes = '05';
        } else if (mes == 'junio') {
            numeroMes = '06';
        } else if (mes == 'julio') {
            numeroMes = '07';
        } else if (mes == 'agosto') {
            numeroMes = '08';
        } else if (mes == 'septiembre') {
            numeroMes = '09';
        } else if (mes == 'octubre') {
            numeroMes = '10';
        } else if (mes == 'noviembre') {
            numeroMes = '11';
        } else if (mes == 'diciembre') {
            numeroMes = '12';
        }
        return numeroMes;
    }

    public static fechaActual(): string {
        var date: Date = new Date();
        var anio = date.getFullYear();
        var mes = +date.getMonth() + 1;
        var dia = date.getDate();

        if (mes < 10) {
            if (dia < 10) {
                return anio + '-0' + mes + '-0' + dia;
            } else {
                return anio + '-0' + mes + '-' + dia;
            }
        } else {
            if (dia < 10) {
                return anio + '-' + mes + '-0' + dia;
            } else {
                return anio + '-' + mes + '-' + dia;
            }
        }
    }

    public static horaActual(): string {
        var date: Date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

    public static restarFechas(fecha1: string, fecha2: string): number {
        var day1 = new Date(fecha1);
        var day2 = new Date(fecha2);

        var difference = Math.abs(+day2 - +day1);
        return difference / (1000 * 3600 * 24)
    }

}
