using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class AutorExterno_iniciativa
    {
        public int AutorExterno_iniciativaID { get; set; }
        public int? IniciativaID { get; set; }
        public int? InstitucionID { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
    }
}
