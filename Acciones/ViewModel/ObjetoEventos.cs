using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoEventos
    {
        public int EventoId { get; set; }
        public int LegislaturaId { get; set; }
        public string LegislaturaNombre { get; set; }
        public string NumFolio { get; set; }
        public string Descripcion { get; set; }
        public string Tipo { get; set; }
        public int NumeroAsistentes { get; set; }
        public string Colonia { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public int CP { get; set; }
        public int EstatusId { get; set; }
        public string Estatus { get; set; }
        public string Fecha { get; set; }
    }
}
