using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Acciones.Models;

namespace Acciones.ViewModel
{
    public class IniciativasVM
    {
        public Iniciativas IniciativadBase { get; set; }

        public string Legislatura { get; set; }

        public string TipoIniciativa { get; set; }
        public string Presidente { get; set; }
        public string Promotor { get; set; }
        public string LogoPresidente { get; set; }
        public string LogoPromotor { get; set; }
        public string EstatusIniciativa { get; set; }
        public IEnumerable<ArchivosIniciativas> LstArchivosIniciativas { get; set; }
        public IEnumerable<Comisiones> LstComisiones { get; set; }
        public IEnumerable<Diputado> LstDiputados { get; set; }
    }
}
