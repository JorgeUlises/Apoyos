using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoPeticiones
    {
        public int PeticionId { get; set; }
        public int LegislaturaId { get; set; }
        public string LegislaturaNombre { get; set; }
        public string NumFolio { get; set; }
        public int OrigenPeticionId { get; set; }
        public string OrigenPeticion { get; set; }
        public string NombreCompleto { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int EstatusId { get; set; }
        public string Estatus { get; set; }
        public string FechaRegistro { get; set; }
        public int diasSolucion { get; set; }
        public int diasTranscurridos { get; set; }
        public IEnumerable<DetalleCategoriaSubcategoria> detalleCategoriaSubcategoria { get; set; }
    }
}
