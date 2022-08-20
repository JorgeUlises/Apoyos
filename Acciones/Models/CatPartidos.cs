using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class CatPartidos
    {
        public CatPartidos()
        {

        }

        public int PartidoId { get; set; }
        public string Nombre { get; set; }
        public string Logotipo { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
    }
}
