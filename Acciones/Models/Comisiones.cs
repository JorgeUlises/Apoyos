using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class Comisiones
    {
        public int ComisionId { get; set; }
        public string Nombre { get; set; }
        public int? NumeroSecuencial { get; set; }
        public int? LegislaturaId { get; set; }
        public string Comentario { get; set; }
        public int? Estatus { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioregistroId { get; set; }
    }
}
