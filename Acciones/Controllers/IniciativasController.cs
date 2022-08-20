using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using ClosedXML.Excel;
using System.IO;
using System.Data;
using Microsoft.AspNetCore.Http;

namespace Acciones.Controllers
{
    public class IniciativasController : Controller
    {
        private readonly dbAccionesContext _context;

        public IniciativasController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Iniciativas
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            LLegis.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegIniciativa"] = LLegis;

            List<SelectListItem> LstTipoIniciativa = new SelectList(_context.CatTipoIniciativas, "CatTipoIniciativaId", "Nombre").ToList();
            LstTipoIniciativa.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TipoIniciativa"] = LstTipoIniciativa;

            List<SelectListItem> LstEstatusIniciativa = new SelectList(_context.EstatusIniciativas, "EstatusIniciativasId", "Nombre").ToList();
            LstEstatusIniciativa.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["EstatusIniciativa"] = LstEstatusIniciativa;


            //List<SelectListItem> LstDiputados = new SelectList(_context.Diputados, "DiputadoId", "Nombre").ToList();
            List<SelectListItem> LstDiputados = _context.Diputados.Where(d => d.LegislaturaId == LegId).OrderBy(d => d.Paterno).Select(d => new SelectListItem { Value = d.DiputadoId.ToString(), Text = d.Nombre + " " + d.Paterno + " " + d.Materno }).ToList();
            LstDiputados.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["Presidente"] = LstDiputados;

            ViewData["Promotor"] = LstDiputados;


            ViewBag.JavaScriptFunction = string.Format("FiltraIniciativa();");

            return View(await _context.Iniciativas.ToListAsync());
        }

        // GET: Iniciativas/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var iniciativas = await _context.Iniciativas
                .FirstOrDefaultAsync(m => m.IniciativaId == id);
            if (iniciativas == null)
            {
                return NotFound();
            }

            return View(iniciativas);
        }

        // GET: Iniciativas/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Iniciativas/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IniciativaId,LegislaturaId,CatTipoIniciativaId,PresidenteId,PromotorId,NumTurno,NumeroSecuencial,Titulo,Clasificacion,EstatusIniciativaId,DocumentoReferencia,LinkReferencia,FechaRecibido,FechaTurno,FechaAprobacionComision,FechaAprobabcionPleno,FechaPublicacionSa,FechaBaja,PresentadorIntExt,NumeroPresentadoresInt,NumeroPresentadoresExt,Notas,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Iniciativas iniciativas)
        {
            if (ModelState.IsValid)
            {
                _context.Add(iniciativas);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(iniciativas);
        }

        // GET: Iniciativas/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var iniciativas = await _context.Iniciativas.FindAsync(id);
            if (iniciativas == null)
            {
                return NotFound();
            }
            return View(iniciativas);
        }

        // POST: Iniciativas/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IniciativaId,LegislaturaId,CatTipoIniciativaId,PresidenteId,PromotorId,NumTurno,NumeroSecuencial,Titulo,Clasificacion,EstatusIniciativaId,DocumentoReferencia,LinkReferencia,FechaRecibido,FechaTurno,FechaAprobacionComision,FechaAprobabcionPleno,FechaPublicacionSa,FechaBaja,PresentadorIntExt,NumeroPresentadoresInt,NumeroPresentadoresExt,Notas,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Iniciativas iniciativas)
        {
            if (id != iniciativas.IniciativaId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(iniciativas);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!IniciativasExists(iniciativas.IniciativaId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(iniciativas);
        }

        // GET: Iniciativas/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var iniciativas = await _context.Iniciativas
                .FirstOrDefaultAsync(m => m.IniciativaId == id);
            if (iniciativas == null)
            {
                return NotFound();
            }

            return View(iniciativas);
        }

        // POST: Iniciativas/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var iniciativas = await _context.Iniciativas.FindAsync(id);
        //    _context.Iniciativas.Remove(iniciativas);
        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        private bool IniciativasExists(int id)
        {
            return _context.Iniciativas.Any(e => e.IniciativaId == id);
        }


        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            BORRA_INICIATIVA(id);

            var iniciativa = await _context.Iniciativas.FindAsync(id);
            _context.Iniciativas.Remove(iniciativa);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }


        /************************************************************
            Inserta Nueva Iniciativa
        *************************************************************/
        [HttpPost]
        public int InsertaNuevaIniciativa(int LegislaturaId, int TipoIniciativaId, int PresidenteId, int PromotorId, string FolioIniciativa, string NumSecuencial, string TituloIni, string ClasificacionIni, int EstatusIniciativaId, string LinkPagina, string FechaRecibidoIni, string FechaComisionIni, string FechaPlenoIni, string FechaPublicaIni, string DescripcionIni)
        {

            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            int DiputadoId = 8;

            Iniciativas iniciativa = new Iniciativas();
            iniciativa.LegislaturaId = LegislaturaId;
            iniciativa.CatTipoIniciativaId = TipoIniciativaId;
            iniciativa.PresidenteId = PresidenteId;
            iniciativa.PromotorId = PromotorId;
            iniciativa.NumTurno = FolioIniciativa ?? "";
            iniciativa.NumeroSecuencial = Int16.Parse(NumSecuencial ?? "0");
            iniciativa.Titulo = TituloIni ?? "";
            iniciativa.Clasificacion = ClasificacionIni ?? "";
            iniciativa.EstatusIniciativaId = EstatusIniciativaId;
            iniciativa.LinkReferencia = LinkPagina ?? "";
            iniciativa.FechaRecibido = FechaRecibidoIni == null || FechaRecibidoIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaRecibidoIni + " 00:00:00");
            iniciativa.FechaAprobacionComision = FechaComisionIni == null || FechaComisionIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaComisionIni + " 00:00:00");
            iniciativa.FechaAprobabcionPleno = FechaPlenoIni == null || FechaPlenoIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaPlenoIni + " 00:00:00");
            iniciativa.FechaBaja = FechaPublicaIni == null || FechaPublicaIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaPublicaIni + " 00:00:00");
            iniciativa.Notas = DescripcionIni ?? "";
            iniciativa.FechaRegistro = DateTime.Now;
            iniciativa.FechaUltimoCambio = DateTime.Now;

            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            iniciativa.UsuarioRegistro = idUsr;
            //            iniciativa.DiputadoId = DiputadoId;

            try
            {
                _context.Iniciativas.Add(iniciativa);
                _context.SaveChanges();

                if (iniciativa.IniciativaId != 0)
                {
                    return iniciativa.IniciativaId;

                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el registro de publicidad");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar un registro de publicidad: {0}", e.Message);
                return -1;
            }
        }

        /************************************************************
            Actualiza Iniciativa
        *************************************************************/
        [HttpPost]
        public int ActualizaIniciativa(int IniciativaId, int LegislaturaId, int TipoIniciativaId, int PresidenteId, int PromotorId, string FolioIniciativa, string NumSecuencial, string TituloIni, string ClasificacionIni, int EstatusIniciativaId, string LinkPagina, string FechaRecibidoIni, string FechaComisionIni, string FechaPlenoIni, string FechaPublicaIni, string DescripcionIni)
        {
            var iniciativa = _context.Iniciativas.Find(IniciativaId);
            iniciativa.LegislaturaId = LegislaturaId;
            iniciativa.CatTipoIniciativaId = TipoIniciativaId;
            iniciativa.PresidenteId = PresidenteId;
            iniciativa.PromotorId = PromotorId;
            iniciativa.NumTurno = FolioIniciativa ?? "";
            iniciativa.NumeroSecuencial = Int16.Parse(NumSecuencial ?? "0");
            iniciativa.Titulo = TituloIni ?? "";
            iniciativa.Clasificacion = ClasificacionIni ?? "";
            iniciativa.EstatusIniciativaId = EstatusIniciativaId;
            iniciativa.LinkReferencia = LinkPagina ?? "";
            iniciativa.FechaRecibido = FechaRecibidoIni == null || FechaRecibidoIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaRecibidoIni + " 00:00:00");
            iniciativa.FechaAprobacionComision = FechaComisionIni == null || FechaComisionIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaComisionIni + " 00:00:00");
            iniciativa.FechaAprobabcionPleno = FechaPlenoIni == null || FechaPlenoIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaPlenoIni + " 00:00:00");
            iniciativa.FechaPublicacionSa = FechaPublicaIni == null || FechaPublicaIni == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(FechaPublicaIni + " 00:00:00");
            iniciativa.Notas = DescripcionIni ?? "";
            iniciativa.FechaUltimoCambio = DateTime.Now;
            try
            {
                _context.Update(iniciativa);
                _context.SaveChanges();

                if (iniciativa.IniciativaId != 0)
                {
                    return iniciativa.IniciativaId;
                }
                else
                {
                    Console.WriteLine("No se actualizó en la BD la iniciativa");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al actualizar la iniciativa: {0}", e.Message);
                return -1;
            }
        }

        /****************************************************************************
            Obtiene Listado de INICIATIVAS 
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<IniciativasVM> ObtieneListadoIniciativas(int RegXpag, int offsetPeticiones, int LegislaturaId, string Folio, int TipoIniciativaId, int EstatusIniciativaId, string Titulo, int AutorId, int PromotorId, int PresidenteId, int NumIniciativa, string FechaInicioIngreso, string FechaFinIngreso, string FechaInicioComision, string FechaFinComision, string FechaInicioPleno, string FechaFinPleno)
        {
            IEnumerable<IniciativasVM> ListaObjetos = new List<IniciativasVM>();
            ListaObjetos = (IEnumerable<IniciativasVM>)(
                    from iniciativas in _context.Iniciativas
                    join tipoIniciativa in _context.CatTipoIniciativas on iniciativas.CatTipoIniciativaId equals tipoIniciativa.CatTipoIniciativaId
                    join estatus in _context.EstatusIniciativas on iniciativas.EstatusIniciativaId equals estatus.EstatusIniciativasId
                    join legislatura in _context.Legislaturas on iniciativas.LegislaturaId equals legislatura.LegislaturaId
                    //join diputados in _context.Diputados on iniciativas.PresidenteId equals diputados.DiputadoId
                    //join diputados_2 in _context.Diputados on iniciativas.PromotorId equals diputados_2.DiputadoId

                    where true && String.IsNullOrEmpty(Folio) ? (true) : iniciativas.NumTurno.Contains(Folio)
                    where true && (LegislaturaId == 0) ? (true) : iniciativas.LegislaturaId == LegislaturaId
                    where true && (TipoIniciativaId <= 0) ? (true) : iniciativas.CatTipoIniciativaId == TipoIniciativaId
                    where true && (EstatusIniciativaId <= 0) ? (true) : iniciativas.EstatusIniciativaId == EstatusIniciativaId
                    where true && String.IsNullOrEmpty(Titulo) ? (true) : iniciativas.Titulo.Contains(Titulo)
                    where true && (AutorId == 0) ? (true) : _context.DiputadoIniciativa.Where(di => di.DiputadoId == AutorId).Select(di => di.IniciativaId).Contains(iniciativas.IniciativaId)
                    //where true && (PromotorId <= 0) ? (true) : iniciativas.PromotorId == PromotorId
                    //where true && (PresidenteId <= 0) ? (true) : iniciativas.PresidenteId == PresidenteId
                    where true && (NumIniciativa == 0) ? (true) : iniciativas.NumeroSecuencial == NumIniciativa
                    where true && (FechaInicioIngreso == "0" && FechaFinIngreso == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaRecibido >= DateTime.ParseExact(FechaInicioIngreso, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaRecibido <= DateTime.ParseExact(FechaFinIngreso, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)
                    where true && (FechaInicioComision == "0" && FechaFinComision == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaAprobacionComision >= DateTime.ParseExact(FechaInicioComision, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaAprobacionComision <= DateTime.ParseExact(FechaFinComision, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)
                    where true && (FechaInicioPleno == "0" && FechaFinPleno == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaAprobabcionPleno >= DateTime.ParseExact(FechaInicioPleno, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaAprobabcionPleno <= DateTime.ParseExact(FechaFinPleno, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)

                    //orderby Convert.ToInt32(iniciativas.NumTurno) descending
                    orderby iniciativas.NumTurno descending
                    //orderby iniciativas.FechaRecibido

                    select new IniciativasVM
                    {
                        Legislatura = legislatura.Nombre,
                        TipoIniciativa = tipoIniciativa.Nombre,
                        EstatusIniciativa = estatus.Nombre,
                        //Presidente = diputados.Nombre + " " + diputados.Paterno + " " + diputados.Materno,
                        //Promotor = diputados_2.Nombre + " " + diputados_2.Paterno + " " + diputados_2.Materno,
                        Presidente = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PresidenteId).Select(d => d.Nombre + " " + d.Paterno + " " + d.Materno).FirstOrDefault() ?? "",
                        Promotor = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PromotorId).Select(d => d.Nombre + " " + d.Paterno + " " + d.Materno).FirstOrDefault() ?? "",
                        LogoPresidente = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PresidenteId).Select(d => d.Notas).FirstOrDefault(),
                        LogoPromotor = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PromotorId).Select(d => d.Notas).FirstOrDefault(),

                        IniciativadBase = new Iniciativas
                        {
                            IniciativaId = iniciativas.IniciativaId,
                            LegislaturaId = iniciativas.LegislaturaId,
                            CatTipoIniciativaId = iniciativas.CatTipoIniciativaId,
                            PresidenteId = iniciativas.PresidenteId,
                            PromotorId = iniciativas.PromotorId,
                            NumTurno = iniciativas.NumTurno,
                            NumeroSecuencial = iniciativas.NumeroSecuencial,
                            Titulo = iniciativas.Titulo,
                            Clasificacion = iniciativas.Clasificacion,
                            EstatusIniciativaId = iniciativas.EstatusIniciativaId,
                            FechaRecibido = iniciativas.FechaRecibido,
                            FechaAprobacionComision = iniciativas.FechaAprobacionComision,
                            FechaAprobabcionPleno = iniciativas.FechaAprobabcionPleno,
                            FechaPublicacionSa = iniciativas.FechaPublicacionSa == null ? new DateTime(1900, 1, 1) : iniciativas.FechaPublicacionSa,
                            FechaBaja = iniciativas.FechaBaja,
                            Notas = iniciativas.Notas,
                            LinkReferencia = iniciativas.LinkReferencia
                        },
                        //NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == publicidad.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                        //NombreColonia = _context.Colonias.Where(c => c.ColoniaId == publicidad.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                        //NombreCalle = _context.Calles.Where(c => c.CalleId == publicidad.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                        //TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == publicidad.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                        //OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == publicidad.OrigenId).Select(o => o.Nombre).FirstOrDefault(),

                        LstArchivosIniciativas = (List<ArchivosIniciativas>)(
                            from archivoIniciativa in _context.ArchivosIniciativas.Where(ai => ai.IniciativaId == iniciativas.IniciativaId)
                            select new ArchivosIniciativas
                            {
                                ArchivosIniciativaId = archivoIniciativa.ArchivosIniciativaId,
                                IniciativaId = archivoIniciativa.IniciativaId,
                                NombreArchivo = archivoIniciativa.NombreArchivo,
                                Url = archivoIniciativa.Url
                            }
                        ),
                        LstComisiones = (List<Comisiones>)(
                            from comiIniciativas in _context.ComisionesXiniciativa.Where(ci => ci.IniciativaId == iniciativas.IniciativaId)
                            join comisiones in _context.Comisiones on comiIniciativas.ComisionId equals comisiones.ComisionId
                            select new Comisiones
                            {
                                ComisionId = (int)comiIniciativas.ComisionId,
                                Nombre = comisiones.Nombre
                            }
                        ),
                        LstDiputados = (List<Diputado>)(
                            from dipIniciativas in _context.DiputadoIniciativa.Where(di => di.IniciativaId == iniciativas.IniciativaId)
                            join diputados in _context.Diputados on dipIniciativas.DiputadoId equals diputados.DiputadoId
                            select new Diputado
                            {
                                DiputadoId = (int)dipIniciativas.DiputadoId,
                                Nombre = diputados.Nombre + " " + diputados.Paterno + " " + diputados.Materno,
                                Notas = diputados.Notas
                            }
                        )

                    }).Skip(offsetPeticiones).Take(RegXpag); ;
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Número de Registros de INICIATIVAS con FILTRO
        *****************************************************************************/
        [HttpGet]
        public int ObtieneNumIniciativasFiltrados(int LegislaturaId, string Folio, int TipoIniciativaId, int EstatusIniciativaId, string Titulo, int AutorId, int PromotorId, int PresidenteId, int NumIniciativa, string FechaInicioIngreso, string FechaFinIngreso, string FechaInicioComision, string FechaFinComision, string FechaInicioPleno, string FechaFinPleno)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return 0;
            }

            var results =
                   from iniciativas in _context.Iniciativas
                   join tipoIniciativa in _context.CatTipoIniciativas on iniciativas.CatTipoIniciativaId equals tipoIniciativa.CatTipoIniciativaId
                   join estatus in _context.EstatusIniciativas on iniciativas.EstatusIniciativaId equals estatus.EstatusIniciativasId
                   join legislatura in _context.Legislaturas on iniciativas.LegislaturaId equals legislatura.LegislaturaId
                   //join diputados in _context.Diputados on iniciativas.PresidenteId equals diputados.DiputadoId
                   //join diputados_2 in _context.Diputados on iniciativas.PromotorId equals diputados_2.DiputadoId

                   where true && String.IsNullOrEmpty(Folio) ? (true) : iniciativas.NumTurno.Contains(Folio)
                   where true && (LegislaturaId == 0) ? (true) : iniciativas.LegislaturaId == LegislaturaId
                   where true && (TipoIniciativaId == 0) ? (true) : iniciativas.CatTipoIniciativaId == TipoIniciativaId
                   where true && (EstatusIniciativaId == 0) ? (true) : iniciativas.EstatusIniciativaId == EstatusIniciativaId
                   where true && String.IsNullOrEmpty(Titulo) ? (true) : iniciativas.Titulo.Contains(Titulo)
                   where true && (AutorId == 0) ? (true) : _context.DiputadoIniciativa.Where(di => di.DiputadoId == AutorId).Select(di => di.IniciativaId).Contains(iniciativas.IniciativaId)
                   //where true && (PromotorId == 0) ? (true) : iniciativas.PromotorId == PromotorId
                   //where true && (PresidenteId == 0) ? (true) : iniciativas.PresidenteId == PresidenteId
                   where true && (NumIniciativa == 0) ? (true) : iniciativas.NumeroSecuencial == NumIniciativa
                   where true && (FechaInicioIngreso == "0" && FechaFinIngreso == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaRecibido >= DateTime.ParseExact(FechaInicioIngreso, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaRecibido <= DateTime.ParseExact(FechaFinIngreso, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)
                   where true && (FechaInicioComision == "0" && FechaFinComision == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaAprobacionComision >= DateTime.ParseExact(FechaInicioComision, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaAprobacionComision <= DateTime.ParseExact(FechaFinComision, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)
                   where true && (FechaInicioPleno == "0" && FechaFinPleno == "0") ? (true) : _context.Iniciativas.Where(i => i.FechaAprobabcionPleno >= DateTime.ParseExact(FechaInicioPleno, "dd-MM-yyyy HH:mm", null) && iniciativas.FechaAprobabcionPleno <= DateTime.ParseExact(FechaFinPleno, "dd-MM-yyyy HH:mm", null)).Select(i => i.IniciativaId).Contains(iniciativas.IniciativaId)

                   select iniciativas.IniciativaId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Registros de INICIATIVAS
        ********************************************************************/
        public Int32 numeroIniciativas()
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Iniciativas]";
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Obtiene Datos de INICIATIVA con iniciativaId
        *****************************************************************************/
        [HttpGet]
        public IniciativasVM GetDatosIniciativa(int iniciativaId)
        {
            IniciativasVM Objeto = new IniciativasVM();

            Objeto = _context.Iniciativas.Where(i => i.IniciativaId == iniciativaId).Select(ini =>

                     new IniciativasVM
                     {
                         IniciativadBase = new Iniciativas
                         {
                             IniciativaId = ini.IniciativaId,
                             LegislaturaId = ini.LegislaturaId,
                             CatTipoIniciativaId = ini.CatTipoIniciativaId,
                             PresidenteId = ini.PresidenteId,
                             PromotorId = ini.PromotorId,
                             NumTurno = ini.NumTurno,
                             NumeroSecuencial = ini.NumeroSecuencial,
                             Titulo = ini.Titulo,
                             Clasificacion = ini.Clasificacion,
                             EstatusIniciativaId = ini.EstatusIniciativaId,
                             FechaRecibido = ini.FechaRecibido,
                             FechaAprobacionComision = ini.FechaAprobacionComision,
                             FechaAprobabcionPleno = ini.FechaAprobabcionPleno,
                             FechaPublicacionSa = ini.FechaPublicacionSa == null ? new DateTime(1900, 1, 1) : ini.FechaPublicacionSa,
                             FechaBaja = ini.FechaBaja,
                             Notas = ini.Notas,
                             LinkReferencia = ini.LinkReferencia
                         },
                         Legislatura = _context.Legislaturas.Where(l => l.LegislaturaId == ini.LegislaturaId).Select(l => l.Nombre).FirstOrDefault(),
                         //NombreCiudadano = _context.Ciudadanos.Where(c => c.CiudadanoId == pu.CiudadanoId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault(),
                         //NombreColonia = _context.Colonias.Where(c => c.ColoniaId == pu.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault(),
                         //NombreCalle = _context.Calles.Where(c => c.CalleId == pu.CalleId).Select(c => c.NombreCalle).FirstOrDefault(),
                         //TipoPublicidad = _context.TipoPublicidad.Where(p => p.TipoPublicidadId == p.TipoPublicidadId).Select(p => p.Nombre).FirstOrDefault(),
                         //OrigenPublicidad = _context.OrigenPublicidad.Where(o => o.OrigenPublicidadId == pu.OrigenId).Select(o => o.Nombre).FirstOrDefault()
                     }).FirstOrDefault();
            return Objeto;
        }


        /****************************************************************************
            Obtiene Datos de una INICIATIVAS 
        *****************************************************************************/
        [HttpGet]
        public IniciativasVM ObtieneDatosIniciativa(int IniciativaId)
        {
            IniciativasVM ObjetoIni = new IniciativasVM();
            ObjetoIni = (IniciativasVM)(
                    from iniciativas in _context.Iniciativas.Where(i => i.IniciativaId == IniciativaId)
                    join tipoIniciativa in _context.CatTipoIniciativas on iniciativas.CatTipoIniciativaId equals tipoIniciativa.CatTipoIniciativaId
                    join estatus in _context.EstatusIniciativas on iniciativas.EstatusIniciativaId equals estatus.EstatusIniciativasId
                    join legislatura in _context.Legislaturas on iniciativas.LegislaturaId equals legislatura.LegislaturaId

                    select new IniciativasVM
                    {
                        Legislatura = legislatura.Nombre,
                        TipoIniciativa = tipoIniciativa.Nombre,
                        EstatusIniciativa = estatus.Nombre,
                        Presidente = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PresidenteId).Select(d => d.Nombre + " " + d.Paterno + " " + d.Materno).FirstOrDefault() ?? "",
                        Promotor = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PromotorId).Select(d => d.Nombre + " " + d.Paterno + " " + d.Materno).FirstOrDefault() ?? "",
                        LogoPresidente = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PresidenteId).Select(d => d.Notas).FirstOrDefault(),
                        LogoPromotor = _context.Diputados.Where(d => d.DiputadoId == iniciativas.PromotorId).Select(d => d.Notas).FirstOrDefault(),

                        IniciativadBase = new Iniciativas
                        {
                            IniciativaId = iniciativas.IniciativaId,
                            LegislaturaId = iniciativas.LegislaturaId,
                            CatTipoIniciativaId = iniciativas.CatTipoIniciativaId,
                            PresidenteId = iniciativas.PresidenteId,
                            PromotorId = iniciativas.PromotorId,
                            NumTurno = iniciativas.NumTurno,
                            NumeroSecuencial = iniciativas.NumeroSecuencial,
                            Titulo = iniciativas.Titulo,
                            Clasificacion = iniciativas.Clasificacion,
                            EstatusIniciativaId = iniciativas.EstatusIniciativaId,
                            FechaRecibido = iniciativas.FechaRecibido,
                            FechaAprobacionComision = iniciativas.FechaAprobacionComision,
                            FechaAprobabcionPleno = iniciativas.FechaAprobabcionPleno,
                            FechaPublicacionSa = iniciativas.FechaPublicacionSa == null ? new DateTime(1900, 1, 1) : iniciativas.FechaPublicacionSa,
                            FechaBaja = iniciativas.FechaBaja,
                            Notas = iniciativas.Notas,
                            LinkReferencia = iniciativas.LinkReferencia
                        },

                        LstArchivosIniciativas = (List<ArchivosIniciativas>)(
                            from archivoIniciativa in _context.ArchivosIniciativas.Where(ai => ai.IniciativaId == iniciativas.IniciativaId)
                            select new ArchivosIniciativas
                            {
                                ArchivosIniciativaId = archivoIniciativa.ArchivosIniciativaId,
                                IniciativaId = archivoIniciativa.IniciativaId,
                                NombreArchivo = archivoIniciativa.NombreArchivo,
                                Url = archivoIniciativa.Url
                            }
                        ),
                        LstComisiones = (List<Comisiones>)(
                            from comiIniciativas in _context.ComisionesXiniciativa.Where(ci => ci.IniciativaId == iniciativas.IniciativaId)
                            join comisiones in _context.Comisiones on comiIniciativas.ComisionId equals comisiones.ComisionId
                            select new Comisiones
                            {
                                ComisionId = (int)comiIniciativas.ComisionId,
                                Nombre = comisiones.Nombre
                            }
                        ),
                        LstDiputados = (List<Diputado>)(
                            from dipIniciativas in _context.DiputadoIniciativa.Where(di => di.IniciativaId == iniciativas.IniciativaId)
                            join diputados in _context.Diputados on dipIniciativas.DiputadoId equals diputados.DiputadoId
                            select new Diputado
                            {
                                DiputadoId = (int)dipIniciativas.DiputadoId,
                                Nombre = diputados.Nombre + " " + diputados.Paterno + " " + diputados.Materno,
                                Notas = diputados.Notas
                            }
                        )

                    }).FirstOrDefault();
            return ObjetoIni;
        }

        /************************************************************
            Obtiene Diputados 
        *************************************************************/
        public IEnumerable<DiputadoConLogoPartido> ObtieneDiputadosDisponibles(int LegislaturaID, int IniciativaId)
        {
            IEnumerable<DiputadoConLogoPartido> ListaObjetos = new List<DiputadoConLogoPartido>();
            ListaObjetos = (IEnumerable<DiputadoConLogoPartido>)(
                    from Diputado in _context.Diputados.Where(d => d.LegislaturaId == LegislaturaID && d.Estatus == 1)
                        //join partido in _context.Partidos on Diputado.PartidoId equals partido.PartidoId
                    where Diputado.Estatus == 1
                    orderby Diputado.Paterno
                    select new DiputadoConLogoPartido
                    {
                        DiputadoId = Diputado.DiputadoId,
                        //Nombre = Diputado.Nombre + " " + Diputado.Paterno + " " + Diputado.Materno,
                        Nombre = Diputado.Paterno + " " + Diputado.Materno + " " + Diputado.Nombre,
                        //partidoId = partido.PartidoId,
                        Logo = Diputado.Notas,
                        //NombrePartido = partido.Nombre,
                        Diputadoseleccionado = _context.DiputadoIniciativa.Where(di => di.IniciativaId == IniciativaId && di.DiputadoId == Diputado.DiputadoId).Count()
                    });
            return ListaObjetos;
        }

        /************************************************************
        Obtiene Comisiones dISPONIBLES
        *************************************************************/
        public IEnumerable<Comisiones> ObtieneComisionDiputadoCargo(int LegislaturaID, int IniciativaId)
        {
            IEnumerable<Comisiones> ListaObjetos = new List<Comisiones>();
            ListaObjetos = (IEnumerable<Comisiones>)(
                    from comisiones in _context.Comisiones.Where(d => d.LegislaturaId == LegislaturaID && d.Estatus == 1)
                    select new Comisiones
                    {
                        ComisionId = comisiones.ComisionId,
                        Nombre = comisiones.Nombre,
                        Estatus = _context.ComisionesXiniciativa.Where(ci => ci.IniciativaId == IniciativaId && ci.ComisionId == comisiones.ComisionId).Count(),
                    });
            return ListaObjetos;
        }


        /************************************************************
            Registra o Elimina un Diputado como Autor de Inicativa
        *************************************************************/
        [HttpPost]
        public int Guarda_Elimina_DiputadoAutor(int iniciativaId, int diputadoId, int cbDiputadoAuto)
        {
            if (cbDiputadoAuto == 0)
            {

                try
                {
                    DiputadoIniciativa diputado_iniciativa = _context.DiputadoIniciativa.Where(di => di.IniciativaId == iniciativaId && di.DiputadoId == diputadoId).FirstOrDefault();
                    if (diputado_iniciativa != null)
                    {
                        _context.DiputadoIniciativa.Remove(diputado_iniciativa);
                        _context.SaveChanges();
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error al Insertar un registro en DiputadoIniciativa: {0}", e.Message);
                    return -1;
                }
            }
            else
            {
                try
                {
                    DiputadoIniciativa objeto = new DiputadoIniciativa()
                    {
                        IniciativaId = iniciativaId,
                        DiputadoId = diputadoId,
                        FechaRegistro = DateTime.Now,
                        FechaUltimoCambio = DateTime.Now,
                        UsuarioRegistro = 1
                    };
                    _context.DiputadoIniciativa.Add(objeto);
                    _context.SaveChanges();
                    return 2;
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error al Insertar un registro en DiputadoIniciativa: {0}", e.Message);
                    return -1;
                }
            }
        }


        /************************************************************
            Registra o Elimina una Comisión de una Inicativa
        *************************************************************/
        [HttpPost]
        public int Guarda_Elimina_Comision(int iniciativaId, int comisionId, int cbComision)
        {
            if (cbComision == 0)
            {

                try
                {
                    ComisionesXiniciativa comision_iniciativa = _context.ComisionesXiniciativa.Where(ci => ci.IniciativaId == iniciativaId && ci.ComisionId == comisionId).FirstOrDefault();
                    if (comision_iniciativa != null)
                    {
                        _context.ComisionesXiniciativa.Remove(comision_iniciativa);
                        _context.SaveChanges();
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error al Insertar un registro en Comisión-Iniciativa: {0}", e.Message);
                    return -1;
                }
            }
            else
            {
                try
                {
                    ComisionesXiniciativa objeto = new ComisionesXiniciativa()
                    {
                        IniciativaId = iniciativaId,
                        ComisionId = comisionId,
                        FechaRegistro = DateTime.Now,
                        FechaUltimoCambio = DateTime.Now,
                        UsuarioRegistro = 1
                    };
                    _context.ComisionesXiniciativa.Add(objeto);
                    _context.SaveChanges();
                    return 2;
                }
                catch (Exception e)
                {
                    Console.WriteLine("Error al Insertar un registro en Comisión-Iniciativa: {0}", e.Message);
                    return -1;
                }
            }
        }

        /****************************************************************************
             BORRA INICIATIVA
                 1. AUTORES
                 2. COMISIONES
                 3. ARCHIVOS
                 4. INICIATIVA
         *****************************************************************************/
        public int BORRA_INICIATIVA(int idIniciativa)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpDELETE_Iniciativa";
            cmd.Parameters.Add("@IniciativaID", System.Data.SqlDbType.Int).Value = idIniciativa;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /******************************************************************************
         * Iniciativas guarda en EXCEL
         ******************************************************************************/
        public DataTable ObtieneIniciativasExcel()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Listado Iniciativas";
            /*
            0 Legislatura
            1 IniciativaID
            2 Folio
            3 Iniciativa
            4 Tipo
            5 Referencia
            6 NombreArchivo
            7 Autor
            8 FechaRecibido
            9 FechaAprobacionComision
            10 Comision
            11 PresidenteComision
            12 FechaAprobabcionPleno
            13 Estatus
            14 Promotor
            15 Origen
            16 LinkReferencia
            17 Notas
            */
            dt.Columns.Add("Legislatura", typeof(string));                      // 0
            dt.Columns.Add("IniciativaID", typeof(int));                        // 1
            dt.Columns.Add("Folio", typeof(string));                            // 2
            dt.Columns.Add("Iniciativa", typeof(string));                       // 3    
            dt.Columns.Add("Tipo", typeof(string));                             // 4
            dt.Columns.Add("Referencia", typeof(int));                       // 5
            dt.Columns.Add("NombreArchivo", typeof(string));                    // 6    
            dt.Columns.Add("Autor", typeof(string));                            // 7    
            dt.Columns.Add("FechaRecibido", typeof(DateTime));                  // 8
            dt.Columns.Add("FechaAprobacionComision", typeof(DateTime));        // 9    
            dt.Columns.Add("Comision", typeof(string));                         // 10
            dt.Columns.Add("PresidenteComision", typeof(string));               // 11
            dt.Columns.Add("FechaAprobabcionPleno", typeof(DateTime));          // 12
            dt.Columns.Add("Estatus", typeof(string));                          // 13
            dt.Columns.Add("Promotor", typeof(string));                         // 14
            dt.Columns.Add("Origen", typeof(string));                           // 15
            dt.Columns.Add("LinkReferencia", typeof(string));                   // 16
            dt.Columns.Add("Notas", typeof(string));                            // 17

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpIniciativas_Excel";
            cmd.Parameters.Add("@LegislaturaID", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoID", System.Data.SqlDbType.Int).Value = DiputaoId;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    dt.Rows.Add(
                        query.GetString(0),         // Legislatura
                        query.GetInt32(1),          // IniciativaID
                        query.GetString(2),         // Folio
                        query.GetString(3),         // Iniciativa
                        query.GetString(4),         // Tipo
                        query.GetInt32(5),         // Referencia
                        query.GetString(6),         // NombreArchivo
                        query.GetString(7),         // Autor
                        query.GetDateTime(8),       // FechaRecibido
                        query.GetDateTime(9),       // FechaAprobacionComision
                        query.GetString(10),        // Comision
                        query.GetString(11),        // PresidenteComision
                        query.GetDateTime(12),      // FechaAprobabcionPleno
                        query.GetString(13),        // Estatus
                        query.GetString(14),        // Promotor
                        query.GetString(15),        // Origen
                        query.GetString(16),        // LinkReferencia
                        query.GetString(17)         // Notas
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }

        /*
    SELECT
    L.Nombre AS Legislatura,
    I.IniciativaID,
    I.NumTurno AS Folio,
    I.Titulo,
    TI.Nombre,
    I.NumeroSecuencial AS Referencia,
    (SELECT STRING_AGG (NombreArchivo, ',')  FROM ArchivosIniciativas WHERE IniciativaID = I.IniciativaID) AS NombreArchivo,
	(SELECT STRING_AGG(D.Nombre + ' ' + D.Paterno + ' ' + D.Materno, ', ') FROM DiputadoIniciativa AS DI LEFT JOIN Diputados AS D ON D.DiputadoID = DI.DiputadoID WHERE IniciativaID = I.IniciativaID ) AS Autor,
  I.FechaRecibido,
	I.FechaAprobacionComision,
	(SELECT STRING_AGG (C.Nombre, ', ') FROM ComisionesXiniciativa AS CI LEFT JOIN Comisiones AS C ON C.ComisionID = CI.ComisionID WHERE CI.IniciativaID = I.IniciativaID ) AS Comision,
    DPre.Nombre + ' ' + DPre.Paterno + ' ' + DPre.Materno AS PresidenteComision,
	I.FechaAprobabcionPleno,
	EI.Nombre,
	DPro.Nombre + ' ' + DPro.Paterno + ' ' + DPro.Materno AS Promotor,
	I.Clasificacion,
	I.LinkReferencia,
	I.Notas
    FROM iniciativas AS I
    LEFT JOIN CatTipoIniciativa AS TI ON TI.CatTipoIniciativaID = I.CatTipoIniciativaID
    LEFT JOIN EstatusIniciativas AS EI ON EI.EstatusIniciativasID = I.EstatusIniciativaID
    LEFT JOIN Legislatura AS L ON L.LegislaturaID = I.LegislaturaID
    LEFT JOIN Diputados AS DPre ON DPre.DiputadoID = I.PresidenteID
    LEFT JOIN Diputados AS DPro ON DPro.DiputadoID = I.PromotorID
        */



        /***********************************************************************
         *  Excel Lista Iniciativas
         ***********************************************************************/
        public ActionResult IniciativasToExcel()
        {
            DataTable dt = this.ObtieneIniciativasExcel();
            string fileName = "Iniciativas.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }


        /*******************************************************************
            Obtiene el número de Archivos INICIATIVA ID 
        ********************************************************************/
        public Int32 numeroArchivosXiniciativaId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosIniciativas] WHERE IniciativaID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
                     Subir Archivos Anexos a una INICIATIVA
         *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoIniciativa(List<IFormFile> files, int IniciativaId)
        {
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    //subPath = numeroTurno;
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    //nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(PeticionId) + "_" + numeroArchivosXiniciativaId(PeticionId)) + "." + extensionArchivo;
                    nombreArchivoBD = nombreArchivo + "_" + numeroArchivosXiniciativaId(IniciativaId) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\INICIATIVAS\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        var URL = "/Archivos/PETICIONES/INICIATIVAS/" + nombreArchivoBD;

                        GuardaReferenciaArchivoIniciativaBD(nombreArchivo, nombreArchivoBD, URL, IniciativaId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = serverMessage });
        }

        /****************************************************************************
            Guarda Referencia de Archivos INICIATIVA en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoIniciativaBD(string NombreArchivo, string NombreArchivoBD, string URL, int IniciativaId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoIniciativas";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@IniciativaId", System.Data.SqlDbType.Int).Value = IniciativaId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;

            try
            {
                SqlDataReader query = cmd.ExecuteReader();
                conn.Close();

                return "OK";
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return "NO";
            }
        }


        /****************************************************************************
            Obtiene Lista de Archivos de una INICIATIVA ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivosIniciativa> ObtieneListaArchivosIniciativa(int iniciativaId)
        {
            List<ObjetoArchivosIniciativa> ListaObjetos = new List<ObjetoArchivosIniciativa>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDeIniciativas";
            cmd.Parameters.Add("@IniciativaID", System.Data.SqlDbType.Int).Value = iniciativaId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivosIniciativa obj = new ObjetoArchivosIniciativa();
                    obj.ArchivosIniciativaID = query.GetInt32(0);
                    obj.IniciativaID = query.GetInt32(1);
                    obj.NombreArchivo = query.GetString(2);
                    obj.URL = query.GetString(3);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /************************************************************
                    BORRAR Archivo de Iniciativas
        *************************************************************/
        [HttpPost]
        public int BorrarArchivoIniciativa(int archivoId)
        {
            var valReturn = 0;
            try
            {
                var archivoIniciativaObj = _context.ArchivosIniciativas.Find(archivoId);
                _context.ArchivosIniciativas.Remove(archivoIniciativaObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /****************************************************************************
            Obtiene Autores Externos X Iniciativa
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoAutoresExternos> ObtieneAutoresExternosIniciativaId(int iniciativaId)
        {
            IEnumerable<ObjetoAutoresExternos> ListaObjetos = new List<ObjetoAutoresExternos>();
            ListaObjetos = (IEnumerable<ObjetoAutoresExternos>)(
                    from autor in _context.AutorExterno_iniciativa.Where(a => a.IniciativaID == iniciativaId)
                    select new ObjetoAutoresExternos
                    {
                        AutorExternoIniciativaID = (int)autor.AutorExterno_iniciativaID,
                        DependenciaId = (int)autor.InstitucionID,
                        IniciativaID = (int)autor.IniciativaID,
                        NombreDependencia = (string)_context.Dependencias.Where(d => d.DependenciaId == autor.InstitucionID).Select(d => d.NombreDependecia).FirstOrDefault(),
                        NombreRepresentante = (string)_context.Dependencias.Where(d => d.DependenciaId == autor.InstitucionID).Select(d => d.NombreContacto).FirstOrDefault()
                    });
            return ListaObjetos;
        }

        public partial class ObjetoArchivosIniciativa
        {
            public int ArchivosIniciativaID { get; set; }
            public int IniciativaID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
        }

        public partial class ObjetoAutoresExternos
        {
            public int AutorExternoIniciativaID { get; set; }
            public int DependenciaId { get; set; }
            public int IniciativaID { get; set; }
            public string NombreRepresentante { get; set; }
            public string NombreDependencia { get; set; }
        }
    }
}
