using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class DiputadoIniciativa
    {
		public int DiputadoIniciativaId { get; set; }
        public int? IniciativaId { get; set; }
        public int? DiputadoId { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
    }
}
