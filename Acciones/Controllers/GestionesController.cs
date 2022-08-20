using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using System.Globalization;

using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data.Entity.Core.Objects;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;

namespace Acciones.Controllers
{
    public class GestionesController : Controller
    {
        private readonly dbAccionesContext _context;

        public GestionesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Gestiones
        //[Authorize]
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            int DiputadoId = 8;
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegBusqueda"] = LLegis;


            List<SelectListItem> Lcat = new SelectList(_context.Categorias, "CategoriaId", "Descripcion").ToList();
            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["ClasificacionBusqueda"] = Lcat;

            List<SelectListItem> LSubcat = new SelectList(_context.Subcategorias, "SubcategoriasId", "Descripcion").ToList();
            LSubcat.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["SubclasificacionBusqueda"] = LSubcat;


            List<SelectListItem> Lorig = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre").ToList();
            ViewData["OrigenBusqueda"] = Lorig;

            List<SelectListItem> Lestatus = new SelectList(_context.EstatusGestion, "EstatusGestionId", "Nombre").ToList();
            Lestatus.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            ViewData["EstatusBusqueda"] = Lestatus;

            List<SelectListItem> LAsosiaciones = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre").ToList();
            LAsosiaciones.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["AsociacionBusqueda"] = LAsosiaciones;

            List<SelectListItem> LDependencias = new SelectList(_context.Dependencias, "DependenciaId", "NombreDependecia").ToList();
            LDependencias.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["DependenciaBusqueda"] = LDependencias;

            List<SelectListItem> Lresponsables = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();
            Lresponsables.Insert(0, new SelectListItem() { Value = "0", Text = "Sin Asignar" });
            Lresponsables.Insert(0, new SelectListItem() { Value = "-1", Text = "" });
            ViewData["ResponsableBusqueda"] = Lresponsables;


            var dbAccionesContext = _context.Gestiones;
            ViewBag.JavaScriptFunction = string.Format("FiltraGestiones();");
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Gestiones/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gestiones = await _context.Gestiones
                //.Include(g => g.Asociacion)
                //.Include(g => g.Dependecia)
                .Include(g => g.Diputado)
                .Include(g => g.EstatusNavigation)
                .Include(g => g.Legislatura)
                .Include(g => g.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.GestionId == id);
            if (gestiones == null)
            {
                return NotFound();
            }

            return View(gestiones);
        }

        // GET: Gestiones/Create
        public IActionResult Create()
        {
            int DiputadoId = 8;

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["Dependencia"] = new SelectList(_context.Dependencias, "DependenciaId", "NombreDependecia");
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            ViewData["Estatus"] = new SelectList(_context.EstatusGestion, "EstatusGestionId", "Nombre");

            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre");
            
            //ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre");

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegislaturaId"] = LLegis;


            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre");

            List<SelectListItem> Lcat = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();

            Lcat.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["ResponsableAtenderId"] = Lcat;

            Gestiones gestion = new Gestiones();
            gestion.FechaSolicitud = DateTime.Now;
            return View();
        }

        // POST: Gestiones/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("GestionId,LegislaturaId,DiputadoId,AsociacionId,Folio,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Campo1,Campo2,SolicitanteId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro,Costo,ResponsableID")] Gestiones gestiones)
        {
            if (ModelState.IsValid)
            {
                _context.Add(gestiones);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", gestiones.AsociacionId);
            ViewData["Dependencia"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", gestiones.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", gestiones.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusGestion, "EstatusGestionID", "Nombre", gestiones.Estatus);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", gestiones.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", gestiones.OrigenPeticionId);
            return View(gestiones);
        }

        // GET: Gestiones/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            int DiputadoId = 8;
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var gestion = await _context.Gestiones.FindAsync(id);
            if (gestion == null)
            {
                return NotFound();
            }


            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", gestion.AsociacionId);
            //ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", gestion.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", gestion.DiputadoId);

            var valorEstatus = _context.Gestiones.Where(g => g.GestionId == id).Select(g => g.Estatus).SingleOrDefault();
            List<SelectListItem> ListaEstatus = new SelectList(_context.EstatusGestion, "EstatusGestionId", "Nombre", gestion.Estatus).ToList();
            var selected = ListaEstatus.Where(x => x.Value == valorEstatus.ToString()).First();
            selected.Selected = true;
            ViewData["Estatus"] = ListaEstatus;

            /* Nombre del solicitante */
            //ViewData["NomSolicitante"] = _context.Ciudadanos.Where(c => c.CiudadanoId == gestion.SolicitanteId).Select(c => c.NombreCompleto).FirstOrDefault();
            ViewData["NomSolicitante"] = _context.Ciudadanos.Where(c => c.CiudadanoId == gestion.SolicitanteId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault();

            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", gestion.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", gestion.OrigenPeticionId);

            List<SelectListItem> Lresp = new SelectList(_context.Usuarios.Where(u => u.Estatus == 1 && u.DiputadoId == DiputadoId && u.RolId == 3), "UsuarioId", "Nombre").ToList();
            Lresp.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["ResponsableAtenderId"] = Lresp;

            var valorDependenciaId = _context.Gestiones.Where(g => g.GestionId == id).Select(g => g.DependeciaId).SingleOrDefault();
            List<SelectListItem> ListaDepend = new SelectList(_context.Dependencias, "DependenciaId", "NombreDependecia", gestion.DependeciaId).ToList();
            var selectedDep = ListaDepend.Where(x => x.Value == valorDependenciaId.ToString()).First();
            selectedDep.Selected = true;
            ViewData["DependenciasEdit"] = ListaDepend;



            ViewBag.JavaScriptFunction = string.Format("MuestraComplementoGestion(" + id + ");");
            return View(gestion);
        }

        // POST: Gestiones/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("GestionId,LegislaturaId,DiputadoId,AsociacionId,Folio,FechaSolicitud,FechaCompromiso,FechaConclusion,Descripcion,Distrito,OrigenPeticionId,DependeciaId,Estatus,Hito,Campo1,Campo2,SolicitanteId,FechaRegistro,FechaUltimoCambio,UsuarioRegistro,Costo,ResponsableID")] Gestiones gestiones)
        {
            if (id != gestiones.GestionId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(gestiones);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GestionesExists(gestiones.GestionId))
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
            ViewData["Asociaciones"] = new SelectList(_context.Asociaciones, "AsociacionId", "Nombre", gestiones.AsociacionId);
            ViewData["DependeciaId"] = new SelectList(_context.Dependencias, "DependenciaId", "DependenciaId", gestiones.DependeciaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", gestiones.DiputadoId);
            ViewData["Estatus"] = new SelectList(_context.EstatusGestion, "EstatusGestionID", "Nombre", gestiones.Estatus);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", gestiones.LegislaturaId);
            ViewData["OrigenPeticionId"] = new SelectList(_context.OrigenPeticiones, "OrigenPeticionesId", "Nombre", gestiones.OrigenPeticionId);
            return View(gestiones);
        }

        // GET: Gestiones/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var gestiones = await _context.Gestiones
                //.Include(g => g.Asociacion)
                //.Include(g => g.Dependecia)
                .Include(g => g.Diputado)
                .Include(g => g.EstatusNavigation)
                .Include(g => g.Legislatura)
                .Include(g => g.OrigenPeticion)
                .FirstOrDefaultAsync(m => m.GestionId == id);
            if (gestiones == null)
            {
                return NotFound();
            }

            ViewData["NombreSolicitante"] = _context.Ciudadanos.Where(c => c.CiudadanoId == gestiones.SolicitanteId).Select(c => c.Nombre + " " + c.Paterno + " " + c.Materno).FirstOrDefault();
            ViewData["NombreResponsable"] = _context.Usuarios.Where(u => u.UsuarioId == gestiones.ResponsableID).Select(u => u.Nombre + " " + u.Paterno + " " + u.Materno).FirstOrDefault();

            return View(gestiones);
        }

        // POST: Gestiones/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            BORRA_GESTION(id);

            var gestiones = await _context.Gestiones.FindAsync(id);
            _context.Gestiones.Remove(gestiones);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GestionesExists(int id)
        {
            return _context.Gestiones.Any(e => e.GestionId == id);
        }


        /************************************************************************************************************************************************************************************************************************/

        /************************************************************
                    BORRAR Categoría y Subcategoría
        *************************************************************/
        [HttpPost]
        public int BorrarCategoriaSubCategoria(int gestionCategoriaId, int gestionSubCategoriaId)
        {
            var valReturn = 0;
            var gestionCategoriaIdAUX = 0;
            try
            {
                var gestionSubCategoria = _context.GestionSubcategoria.Find(gestionSubCategoriaId);
                _context.GestionSubcategoria.Remove(gestionSubCategoria);
                _context.SaveChanges();

                gestionCategoriaIdAUX = _context.GestionSubcategoria.Where(gsc => gsc.GestionCategoriaId == gestionCategoriaId).Count();

                if (gestionCategoriaIdAUX == 0)
                {
                    var gestionCategoria = _context.GestionCategoria.Find(gestionCategoriaId);
                    _context.GestionCategoria.Remove(gestionCategoria);
                    _context.SaveChanges();
                }

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }

        /************************************************************
                    BORRAR Archivo de Gestión
        *************************************************************/
        [HttpPost]
        public int BorrarArchivoGestion(int archivoId)
        {
            var valReturn = 0;
            try
            {
                var archivoGestionObj = _context.ArchivosGestiones.Find(archivoId);
                _context.ArchivosGestiones.Remove(archivoGestionObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /************************************************************
                    BORRAR Beneficiario de Gestión
        *************************************************************/
        [HttpPost]
        public int BorrarBeneficiarioGestion(int beneficiariosID)
        {
            var valReturn = 0;
            try
            {
                var beneficiarioGestionObj = _context.BeneficiariosGestion.Find(beneficiariosID);
                _context.BeneficiariosGestion.Remove(beneficiarioGestionObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }

        

        /************************************************************
                    BORRAR Archivo de Bitácora Gestión
        *************************************************************/
        [HttpPost]
        public int BorrarArchivoBitacoraGestion(int archivosBitacoraId)
        {
            var valReturn = 0;
            try
            {
                var archivoBitacoraGestionObj = _context.ArchivosBitacorasGestion.Find(archivosBitacoraId);
                _context.ArchivosBitacorasGestion.Remove(archivoBitacoraGestionObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /************************************************************
                    BORRAR Actividad de Bitácora Gestión
        *************************************************************/
        [HttpPost]
        public int BorrarActividadBitacoraGestion(int bitacoraId)
        {
            var valReturn = 0;
            try
            {
                var archivoBitacoraGestionObj = _context.ArchivosBitacorasGestion.Where(abg=> abg.BitacoraGestionId == bitacoraId);
                foreach(ArchivosBitacoraGestion archBG in archivoBitacoraGestionObj)
                {
                    _context.ArchivosBitacorasGestion.Remove(archBG);
                    _context.SaveChanges();
                }

                var bitacoraGestionObj = _context.BitacorasGestion.Find(bitacoraId);
                _context.BitacorasGestion.Remove(bitacoraGestionObj);
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
             BORRA GESTIÓN
                 1. CATEGORIA
                 2. SUBCATEGORIA
                 3. ARCHIVOS
                 4. BENEFICIARIOS
                 5. ARCHIVOS DE SEGUIMIENTO
                 6. ACTIVIDADES DE SEGUIMIENTO
         *****************************************************************************/
        public int BORRA_GESTION(int idGestion)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpDELETE_Gestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
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
        /************************************************************
                    Nueva Gestion
        *************************************************************/
        [HttpPost]
        public int NuevaGestion(int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito, string costo, int responsableId, int dependenciaId, int legislaturaId)
        {
            Gestiones gestion = new Gestiones();
            gestion.OrigenPeticionId = origenSolicitud;
            gestion.Folio = folio ?? "";
            gestion.FechaSolicitud = fechaSolicitud == null || fechaSolicitud == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            gestion.FechaCompromiso = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            gestion.FechaConclusion = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");
            gestion.Estatus = estatus;
            gestion.SolicitanteId = solicitanteId;
            gestion.AsociacionId = asociacionId;
            gestion.Descripcion = descripcionSolicitud ?? "";
            gestion.Hito = hito;
            var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.NumberDecimalSeparator = ".";
            gestion.Costo = float.Parse(costo, ci);
            gestion.ResponsableID = responsableId;

            gestion.Campo1 = "";
            gestion.Campo2 = 0;


            gestion.LegislaturaId = legislaturaId;
            gestion.DiputadoId = 8;
            gestion.Distrito = "V";
            gestion.FechaRegistro = DateTime.Now;
            gestion.FechaUltimoCambio = DateTime.Now;
            gestion.UsuarioRegistro = 1;
            gestion.DependeciaId = dependenciaId;

            try
            {
                _context.Add(gestion);
                _context.SaveChanges();

                if (gestion.GestionId != 0)
                {
                    return gestion.GestionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la Gestión");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la Gestión: {0}", e.Message);
                return -2;
            }
        }


        /************************************************************
            Actualiza Gestión
        *************************************************************/
        [HttpPost]
        public int ActualizaGestion(int idGestion, int origenSolicitud, string folio, string fechaSolicitud, string fechaCompromiso, string fechaConclusion, int estatus, int solicitanteId, int asociacionId, string descripcionSolicitud, int hito, string costo, int responsableId, int dependenciaId, int legislaturaId)
        {
            var gestion = _context.Gestiones.Find(idGestion);

            gestion.OrigenPeticionId = origenSolicitud;
            gestion.Folio = folio ?? "";
            gestion.FechaSolicitud = Convert.ToDateTime(fechaSolicitud + " 00:00:00");
            gestion.FechaCompromiso = Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            gestion.FechaConclusion = Convert.ToDateTime(fechaConclusion + " 00:00:00");
            gestion.Estatus = estatus;
            gestion.SolicitanteId = solicitanteId;
            gestion.AsociacionId = asociacionId;
            gestion.Descripcion = descripcionSolicitud ?? "";
            gestion.Hito = hito;
            var ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.NumberDecimalSeparator = ".";
            gestion.Costo = float.Parse(costo, ci);
            gestion.ResponsableID = responsableId;

            gestion.Campo1 = "";
            gestion.Campo2 = 0;


            gestion.LegislaturaId = legislaturaId;
            gestion.DiputadoId = 8;
            gestion.Distrito = "V";
            gestion.FechaUltimoCambio = DateTime.Now;
            gestion.UsuarioRegistro = 1;
            gestion.DependeciaId = dependenciaId;

            try
            {
                _context.Update(gestion);
                _context.SaveChanges();

                if (gestion.GestionId != 0)
                {
                    return gestion.GestionId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD la petición");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar la petición: {0}", e.Message);
                return -1;
            }
        }

        /****************************************************************************
            Guarda categoría y SubCategoria de una GESTIÓN
        *****************************************************************************/
        public int GuardaCategoriaSubCategoriaBD_G(int idGestion, int categoriaId, int subCategoriaId)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaUnaCategoria_SubCategoria_G";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@CategoriaID", System.Data.SqlDbType.Int).Value = categoriaId;
            cmd.Parameters.Add("@SubCategoriaID", System.Data.SqlDbType.Int).Value = subCategoriaId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
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


        /****************************************************************************
            Obtiene Categorías y Subcategorías de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoCategoriaSubCategoriaGestion> ObtieneListaCatSubCat_G(int idGestion)
        {
            List<ObjetoCategoriaSubCategoriaGestion> ListaObjetos = new List<ObjetoCategoriaSubCategoriaGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneCategoriasSubCategorias_De_Gestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoCategoriaSubCategoriaGestion obj = new ObjetoCategoriaSubCategoriaGestion(); 
                    obj.GestionCategoriaID = query.GetInt32(0);
                    obj.CategoriaID = query.GetInt32(1);
                    obj.DescripcionCat = query.GetString(2);
                    obj.GestionSubcategoriaID = query.GetInt32(3);
                    obj.SubcategoriasID = query.GetInt32(4);
                    obj.DescripcionSubcat = query.GetString(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }



        /****************************************************************************
            Obtiene Lista de Archivos de una Petición ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivosGestion> ObtieneListaArchivos_G(int idGestion)
        {
            List<ObjetoArchivosGestion> ListaObjetos = new List<ObjetoArchivosGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDeGestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivosGestion obj = new ObjetoArchivosGestion();
                    obj.ArchivosGestionesID = query.GetInt32(0);
                    obj.GestionID = query.GetInt32(1);
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


        /****************************************************************************
                    Subir Archivos Anexos de Gestión
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoGestion(List<IFormFile> files, int GestionId)
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

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(GestionId) + "_" + numeroArchivosXgestionId(GestionId)) + "." + extensionArchivo;
                    
                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\GESTION\", nombreArchivoBD);

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
                        var URL = "/Archivos/PETICIONES/GESTION/" + nombreArchivoBD;

                        GuardaReferenciaArchivoGestionBD(nombreArchivo, nombreArchivoBD, URL, GestionId);

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
            Guarda Referencia de Archivos GESTION en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoGestionBD(string NombreArchivo, string NombreArchivoBD, string URL, int GestionId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoGestiones";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@GestionId", System.Data.SqlDbType.Int).Value = GestionId;
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
            Subir Archivos Anexos Gestion - Bitacora
         *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoGestionBitacora(List<IFormFile> files, int GestionId, int BitacoraId)
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

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(BitacoraId) + "_" + numeroArchivosXbitacoraGestionId(BitacoraId)) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\GESTION_SEGUIMIENTO\", nombreArchivoBD);

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
                        var URL = "/Archivos/PETICIONES/GESTION_SEGUIMIENTO/" + nombreArchivoBD;

                        GuardaReferenciaArchivoGestionSeguimientoBD(nombreArchivo, nombreArchivoBD, URL, GestionId, BitacoraId);

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
            Guarda Referencia de Archivos GESTION en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoGestionSeguimientoBD(string NombreArchivo, string NombreArchivoBD, string URL, int GestionId, int BitacoraId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoGestionesBitacora";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@GestionId", System.Data.SqlDbType.Int).Value = GestionId;
            cmd.Parameters.Add("@BitacoraGestionId", System.Data.SqlDbType.Int).Value = BitacoraId;
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
            Guarda Nuevo Beneficiario de una Petición
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevoBeneficiario_G(int idGestion, int beneficiarioId, string descripcionApoyo)
        {
            int personasCount = 0;
            int rtn;
            descripcionApoyo = descripcionApoyo ?? "";

            personasCount = _context.BeneficiariosGestion.Where(bg => bg.GestionId == idGestion && bg.CiudadanoId==beneficiarioId).Count();

            if (personasCount != 0)
            {
                return 0;
            }

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaBeneficiario_Notas_G";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
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


        /****************************************************************************
            Actualiza descripción de GESTION a un Beneficiario
        *****************************************************************************/
        [HttpPost]
        public int ActualizaDescripcionGestionBeneficiario(int idGestion, int beneficiarioId, string descripcionApoyo)
        {
            int rtn;
            descripcionApoyo = descripcionApoyo ?? "";

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpActualizaDescGestionBeneficiario";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@BeneficiarioID", System.Data.SqlDbType.Int).Value = beneficiarioId;
            cmd.Parameters.Add("@Nota", System.Data.SqlDbType.VarChar, 3000).Value = descripcionApoyo;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
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

        /****************************************************************************
            Obtiene Lista de Beneficiarios de una GESTION ID
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoBeneficiariosGestion> ObtieneListaBeneficiariosGestionId(int idGestion)
        {
            List<ObjetoBeneficiariosGestion> ListaObjetos = new List<ObjetoBeneficiariosGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneBeneficiarios_De_Gestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoBeneficiariosGestion obj = new ObjetoBeneficiariosGestion();
                    obj.CiudadanoID = query.GetInt32(0);
                    obj.GestionID = query.GetInt32(1);
                    obj.Notas = query.GetString(2);
                    obj.Estatus = query.GetInt32(3);
                    obj.Latitud = query.GetString(4);
                    obj.Longitud = query.GetString(5);
                    obj.NombreCompleto = query.GetString(6);
                    obj.Colonia = query.GetString(7);
                    obj.Calle = query.GetString(8);
                    obj.BeneficiariosID = query.GetInt32(9);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Bitácora de una GESTIÓN ID
        *****************************************************************************/
        [HttpGet]
        public IEnumerable<ObjetoBitacora> ObtieneBitacoraGestionId(int idGestion)
        {
            IEnumerable<ObjetoBitacora> ListaObjetos = new List<ObjetoBitacora>();
            ListaObjetos = (IEnumerable<ObjetoBitacora>)(
                    from bitacora in _context.BitacorasGestion.Where(b => b.GestionId == idGestion)
                    select new ObjetoBitacora
                    {
                        BitacoraBase = new Bitacora
                        {
                            BitacoraId = bitacora.BitacoraGestionId,
                            FechaRegistro = bitacora.FechaRegistro,
                            FechaCompromiso = bitacora.FechaCompromiso,
                            FechaConclusion = bitacora.FechaConclusion,
                            Estatus = bitacora.Estatus,
                            Descripcion = bitacora.Descripcion,
                            Responsable = bitacora.Responsable
                        },

                        ArchivosRelacionadosBitacora = (List<ArchivosBitacora>)(
                            from archivoBitacora in _context.ArchivosBitacorasGestion.Where(abg => abg.BitacoraGestionId == bitacora.BitacoraGestionId)
                            select new ArchivosBitacora
                            {
                                ArchivosBitacoraId = archivoBitacora.ArchivosBitacoraGestionId,
                                BitacoraId = archivoBitacora.BitacoraGestionId,
                                NombreArchivo = archivoBitacora.NombreArchivo,
                                Url = archivoBitacora.Url
                            }
                        )
                    });
            return ListaObjetos;
        }



        /****************************************************************************
            Guarda Nueva Actividad en Bitácora
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevaActividadBitacora_G(int idGestion, string actividad, string fechaRegistro, string fechaCompromiso, string fechaConclusion, int estatusBitacora, string responsableBitacora)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaActividadBitacoraGestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@Descripcion", System.Data.SqlDbType.VarChar, 3000).Value = actividad;


            cmd.Parameters.Add("@FechaRegistro", System.Data.SqlDbType.DateTime).Value = fechaRegistro == null || fechaRegistro == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRegistro + " 00:00:00");
            cmd.Parameters.Add("@FechaCompromiso", System.Data.SqlDbType.DateTime).Value = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            cmd.Parameters.Add("@FechaConclusion", System.Data.SqlDbType.DateTime).Value = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");

            cmd.Parameters.Add("@Estatus", System.Data.SqlDbType.Int).Value = estatusBitacora;
            cmd.Parameters.Add("@Responsable", System.Data.SqlDbType.VarChar, 200).Value = responsableBitacora == null ? "" : responsableBitacora;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 2;

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

        /****************************************************************************
             ACTUALIZA Actividad en Bitácora
         *****************************************************************************/
        [HttpPost]
        public int ActualizaActividadBitacora_G(int bitacoraId, int idGestion, string actividad, string fechaRegistro, string fechaCompromiso, string fechaConclusion, int estatusBitacora, string responsableBitacora)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpACTUALIZAactividadBitacoraGestion";
            cmd.Parameters.Add("@GestionID", System.Data.SqlDbType.Int).Value = idGestion;
            cmd.Parameters.Add("@BitacoraID", System.Data.SqlDbType.Int).Value = bitacoraId;
            cmd.Parameters.Add("@Descripcion", System.Data.SqlDbType.VarChar, 3000).Value = actividad;


            cmd.Parameters.Add("@FechaRegistro", System.Data.SqlDbType.DateTime).Value = fechaRegistro == null || fechaRegistro == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaRegistro + " 00:00:00");
            cmd.Parameters.Add("@FechaCompromiso", System.Data.SqlDbType.DateTime).Value = fechaCompromiso == null || fechaCompromiso == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaCompromiso + " 00:00:00");
            cmd.Parameters.Add("@FechaConclusion", System.Data.SqlDbType.DateTime).Value = fechaConclusion == null || fechaConclusion == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaConclusion + " 00:00:00");

            cmd.Parameters.Add("@Estatus", System.Data.SqlDbType.Int).Value = estatusBitacora;
            cmd.Parameters.Add("@Responsable", System.Data.SqlDbType.VarChar, 200).Value = responsableBitacora == null ? "" : responsableBitacora;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 2;

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


        /*******************************************************************
            Obtiene el número de Archivos Gestión ID 
        ********************************************************************/
        public Int32 numeroArchivosXgestionId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosGestiones] WHERE GestionID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de Archivos BITACORA Gestión ID 
        ********************************************************************/
        public Int32 numeroArchivosXbitacoraGestionId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosBitacoraGestion] WHERE BitacoraGestionID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }



        public IEnumerable<ObjetoGestiones> ObtieneGestiones(int RegXpag, int offsetPeticiones, int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId, int responsableId)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoGestiones> ListaObjetos = new List<ObjetoGestiones>();
            ListaObjetos = (IEnumerable<ObjetoGestiones>)(
                    from gestiones in _context.Gestiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on gestiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on gestiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusGestiones in _context.EstatusGestion on gestiones.Estatus equals estatusGestiones.EstatusGestionId
                    join legislatura in _context.Legislaturas on gestiones.LegislaturaId equals legislatura.LegislaturaId

                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : gestiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : gestiones.Folio.Contains(folio)
                    where true && (responsableId < 0) ? (true) : gestiones.ResponsableID == responsableId
                    where true && (origenPeticion <= 1) ? (true) : gestiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId < 1) ? (true) : gestiones.Estatus == estatusId
                    where true && (asociacionId <= 0) ? (true) : gestiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 0) ? (true) : gestiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : gestiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Gestiones.Where(g => g.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && g.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(g => g.GestionId).Contains(gestiones.GestionId)
                    where true && (categoriaId == 0) ? (true) : _context.GestionCategoria.Where(gc => gc.GestionId == gestiones.GestionId && gc.CategoriaId == categoriaId).Select(gc => gc.GestionId).Contains(gestiones.GestionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.GestionSubcategoria.Where(gsc => gsc.GestionId == gestiones.GestionId && gsc.SubcategoriaId == subCategoriaId).Select(gsc => gsc.GestionId).Contains(gestiones.GestionId)

                    orderby gestiones.FechaRegistro descending

                    select new ObjetoGestiones
                    {
                        GestionId = gestiones.GestionId,
                        LegislaturaId = (int)gestiones.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = gestiones.Folio,
                        OrigenGestionId = (int)gestiones.OrigenPeticionId,
                        OrigenGestion = origenPeticiones.Nombre,
                        NombreCompleto = ciudadanos.Nombre + " " + ciudadanos.Paterno + " " + ciudadanos.Materno, //ciudadanos.NombreCompleto,
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        Descripcion = gestiones.Descripcion,
                        EstatusId = (int)gestiones.Estatus,
                        diasTranscurridos = (int)(DateTime.Now - (DateTime)gestiones.FechaSolicitud).Days,
                        diasSolucion = (int)(gestiones.FechaConclusion != DateTime.Parse("1900-01-01 00:00:00.000") ? ((DateTime)gestiones.FechaConclusion - (DateTime)gestiones.FechaSolicitud).Days : -1),
                        Estatus = estatusGestiones.Nombre,
                        FechaRegistro = gestiones.FechaRegistro != null ? ((DateTime)gestiones.FechaRegistro).ToShortDateString() : "",
                        Costo = (float)gestiones.Costo,
                        FechaSolicitud = gestiones.FechaSolicitud != null ? ((DateTime)gestiones.FechaSolicitud).ToShortDateString() : "",
                        detalleCategoriaSubcategoria = (List<DetalleCategoriaSubcategoria_G>)(
                            from gestionesCategoria in _context.GestionCategoria.Where(gesC => gesC.GestionId == gestiones.GestionId)
                            join gestionesSubcategoria in _context.GestionSubcategoria on gestionesCategoria.GestionCategoriaId equals gestionesSubcategoria.GestionCategoriaId
                            join categoria in _context.Categorias on gestionesCategoria.CategoriaId equals categoria.CategoriaId
                            join subcategoria in _context.Subcategorias on gestionesSubcategoria.SubcategoriaId equals subcategoria.SubcategoriasId
                            select new DetalleCategoriaSubcategoria_G
                            {
                                GestionId = (int)gestionesCategoria.GestionId,
                                CategoriaId = (int)gestionesCategoria.CategoriaId,
                                Categoria = categoria.Descripcion,
                                SubcategoriaId = (int)gestionesSubcategoria.SubcategoriaId,
                                Subcategoria = subcategoria.Descripcion
                            }
                                )
                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroGestionesXfiltro(int LegislaturaID, int origenPeticion, string folio, int hito, string nombreSolicitante, string descripcion, int categoriaId, int subCategoriaId, int estatusId, string fechaInicioSolicitud, string fechaFinSolicitud, string fechaInicioConclusion, string fechaFinConclusion, int asociacionId, int dependenciaId, int responsableId)
        {
            int diputadoId = 8;
            var results =
                    from gestiones in _context.Gestiones.Where(pet => pet.LegislaturaId == LegislaturaID && pet.DiputadoId == diputadoId)
                    join origenPeticiones in _context.OrigenPeticiones on gestiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on gestiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusGestiones in _context.EstatusGestion on gestiones.Estatus equals estatusGestiones.EstatusGestionId
                    join legislatura in _context.Legislaturas on gestiones.LegislaturaId equals legislatura.LegislaturaId

                    where true && String.IsNullOrEmpty(nombreSolicitante) ? (true) : ciudadanos.NombreCompleto.Contains(nombreSolicitante)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : gestiones.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(folio) ? (true) : gestiones.Folio.Contains(folio)
                    where true && (responsableId < 0) ? (true) : gestiones.ResponsableID == responsableId
                    where true && (origenPeticion <= 1) ? (true) : gestiones.OrigenPeticionId == origenPeticion
                    where true && (estatusId < 1) ? (true) : gestiones.Estatus == estatusId
                    where true && (asociacionId <= 0) ? (true) : gestiones.AsociacionId == asociacionId
                    where true && (dependenciaId <= 0) ? (true) : gestiones.DependeciaId == dependenciaId
                    where true && (hito < 0) ? (true) : gestiones.Hito == hito
                    where true && (fechaInicioSolicitud == "0" && fechaFinSolicitud == "0") ? (true) : _context.Gestiones.Where(g => g.FechaRegistro >= DateTime.ParseExact(fechaInicioSolicitud, "dd-MM-yyyy HH:mm", null) && g.FechaSolicitud <= DateTime.ParseExact(fechaFinSolicitud, "dd-MM-yyyy HH:mm", null)).Select(g => g.GestionId).Contains(gestiones.GestionId)
                    where true && (categoriaId == 0) ? (true) : _context.GestionCategoria.Where(gc => gc.GestionId == gestiones.GestionId && gc.CategoriaId == categoriaId).Select(gc => gc.GestionId).Contains(gestiones.GestionId)
                    where true && (subCategoriaId == 0) ? (true) : _context.GestionSubcategoria.Where(gsc => gsc.GestionId == gestiones.GestionId && gsc.SubcategoriaId == subCategoriaId).Select(gsc => gsc.GestionId).Contains(gestiones.GestionId)

                    select gestiones.GestionId;

            return results.Count();
        }


        /************************************************************
            Obtiene Detall de una Solicitud de Gestión 
        *************************************************************/
        public IEnumerable<ObjetoGestion> ObtieneDetalleGestion(int GestionId)
        {
            IEnumerable<ObjetoGestion> ListaObjetos = new List<ObjetoGestion>();
            ListaObjetos = (IEnumerable<ObjetoGestion>)(
                    from gestiones in _context.Gestiones.Where(ges => ges.GestionId == GestionId)
                        //join asociaciones in _context.Asociaciones on gestiones.AsociacionId equals asociaciones.AsociacionId
                    join origenPeticiones in _context.OrigenPeticiones on gestiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    //join dependencias in _context.Dependencias on gestiones.DependeciaId equals dependencias.DependenciaId
                    join estatus in _context.EstatusGestion on gestiones.Estatus equals estatus.EstatusGestionId
                    join ciudadanos in _context.Ciudadanos on gestiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join usuario in _context.Usuarios.Where(u => u.Estatus == 1) on gestiones.ResponsableID equals usuario.UsuarioId into usrSel
                    from usuario in usrSel.DefaultIfEmpty()

                    select new ObjetoGestion
                    {
                        GestionId = gestiones.GestionId,
                        AsociacionId = (int)gestiones.AsociacionId,
                        //AsociacionNombre = asociaciones.Nombre,
                        AsociacionNombre = _context.Asociaciones.Where(a => a.AsociacionId == gestiones.AsociacionId).Select(a => a.Nombre).FirstOrDefault(),
                        Folio = gestiones.Folio,
                        FechaSolicitud = gestiones.FechaSolicitud,
                        FechaCompromiso = gestiones.FechaCompromiso,
                        FechaConclusion = gestiones.FechaConclusion,
                        Descripcion = gestiones.Descripcion,
                        OrigenPeticionId = gestiones.OrigenPeticionId,
                        OrigenPeticionNombre = origenPeticiones.Nombre,
                        DependeciaId = gestiones.DependeciaId,
                        //DependenciaNombre = dependencias.NombreDependecia,
                        DependenciaNombre = _context.Dependencias.Where(d => d.DependenciaId == gestiones.DependeciaId).Select(d => d.NombreDependecia).FirstOrDefault(),
                        Estatus = gestiones.Estatus,
                        EstatusDescripcion = estatus.Nombre,
                        Hito = gestiones.Hito,
                        Costo = gestiones.Costo,
                        // NombreResponsable = _context.Usuarios.Where(u => u.Estatus == 1 && u.UsuarioId == peticiones.ResponsableID).Select(u => u.Nombre).FirstOrDefault().ToString()??"",
                        NombreResponsable = usuario.Nombre + " " + usuario.Paterno + " " + usuario.Materno,
                        SolicitanteId = gestiones.SolicitanteId,
                        SolicitanteNombre = ciudadanos.Nombre + " " + ciudadanos.Paterno + " " + ciudadanos.Materno // ciudadanos.NombreCompleto
                    });
            return ListaObjetos;
        }


        /*******************************************************************************
            Obtiene Todas las SOLICITUDES DE GESTIÓN con Argumentos para WHERE
        ********************************************************************************/
        public IEnumerable<ObjetoGestiones> ObtieneGestionesXciudadano(int LegislaturaID, int idCiudadano)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoGestiones> ListaObjetos = new List<ObjetoGestiones>();
            ListaObjetos = (IEnumerable<ObjetoGestiones>)(
                    from gestiones in _context.Gestiones.Where(ges => ges.LegislaturaId == LegislaturaID && ges.DiputadoId == diputadoId && ges.SolicitanteId == idCiudadano)
                    join origenPeticiones in _context.OrigenPeticiones on gestiones.OrigenPeticionId equals origenPeticiones.OrigenPeticionesId
                    join ciudadanos in _context.Ciudadanos on gestiones.SolicitanteId equals ciudadanos.CiudadanoId
                    join estatusGestiones in _context.EstatusGestion on gestiones.Estatus equals estatusGestiones.EstatusGestionId
                    join legislatura in _context.Legislaturas on gestiones.LegislaturaId equals legislatura.LegislaturaId

                    orderby gestiones.FechaRegistro descending

                    select new ObjetoGestiones
                    {
                        GestionId = gestiones.GestionId,
                        LegislaturaId = (int)gestiones.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = gestiones.Folio,
                        OrigenGestionId = (int)gestiones.OrigenPeticionId,
                        OrigenGestion = origenPeticiones.Nombre,
                        NombreCompleto = ciudadanos.NombreCompleto,
                        Paterno = ciudadanos.Paterno,
                        Materno = ciudadanos.Materno,
                        Nombre = ciudadanos.Nombre,
                        Descripcion = gestiones.Descripcion,
                        EstatusId = (int)gestiones.Estatus,
                        diasTranscurridos = (int)(DateTime.Now - (DateTime)gestiones.FechaSolicitud).Days,
                        diasSolucion = (int)(gestiones.FechaConclusion != DateTime.Parse("1900-01-01 00:00:00.000") ? ((DateTime)gestiones.FechaConclusion - (DateTime)gestiones.FechaSolicitud).Days : -1),
                        Estatus = estatusGestiones.Nombre,
                        FechaRegistro = gestiones.FechaRegistro != null ? ((DateTime)gestiones.FechaRegistro).ToShortDateString() : "",
                        Costo = (float)gestiones.Costo,
                        FechaSolicitud = gestiones.FechaSolicitud != null ? ((DateTime)gestiones.FechaSolicitud).ToShortDateString() : "",
                        detalleCategoriaSubcategoria = (List<DetalleCategoriaSubcategoria_G>)(
                            from gestionesCategoria in _context.GestionCategoria.Where(gesC => gesC.GestionId == gestiones.GestionId)
                            join gestionesSubcategoria in _context.GestionSubcategoria on gestionesCategoria.GestionCategoriaId equals gestionesSubcategoria.GestionCategoriaId
                            join categoria in _context.Categorias on gestionesCategoria.CategoriaId equals categoria.CategoriaId
                            join subcategoria in _context.Subcategorias on gestionesSubcategoria.SubcategoriaId equals subcategoria.SubcategoriasId
                            select new DetalleCategoriaSubcategoria_G
                            {
                                GestionId = (int)gestionesCategoria.GestionId,
                                CategoriaId = (int)gestionesCategoria.CategoriaId,
                                Categoria = categoria.Descripcion,
                                SubcategoriaId = (int)gestionesSubcategoria.SubcategoriaId,
                                Subcategoria = subcategoria.Descripcion
                            }
                        )
                    });
            return ListaObjetos;
        }
        /************************************************************
            createWhereAnioMes
        *************************************************************/
        private string createWhereAnioMes(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(FechaSolicitud) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(FechaSolicitud) = " + anioSel + " AND MONTH(FechaSolicitud) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes_2
        *************************************************************/
        private string createWhereAnioMes_2(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(Fecha) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(Fecha) = " + anioSel + " AND MONTH(Fecha) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes_3
        *************************************************************/
        private string createWhereAnioMes_3(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return "YEAR(FechaRegistro) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return "YEAR(FechaRegistro) = " + anioSel + " AND MONTH(FechaRegistro) = " + mesSel;
            }
            else
            {
                return "";
            }
        }

        /************************************************************
            createWhereAnioMes
        *************************************************************/
        private string createWhereAnioMes_4(int anioSel, int mesSel)
        {
            if (anioSel != 0 && mesSel == 0)
            {
                return " YEAR(P.FechaSolicitud) = " + anioSel;
            }
            else if (anioSel != 0 && mesSel != 0)
            {
                return " YEAR(P.FechaSolicitud) = " + anioSel + " AND MONTH(P.FechaSolicitud) = " + mesSel;
            }
            else
            {
                return "";
            }
        }
        /*******************************************************************
            Obtiene el número de Gestiones
        ********************************************************************/
        public Int32 numeroGestiones(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            complemento = createWhereAnioMes(anioSel, mesSel);
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de Beneficiarios de Gestiones
        ********************************************************************/
        public Int32 numeroBeneficiariosGestiones(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            complemento = createWhereAnioMes(anioSel, mesSel);
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM BeneficiariosGestion WHERE GestionID IN (SELECT gestionId FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento + ")";
            }
            else
            {
                stm = "SELECT Count(*) FROM BeneficiariosGestion WHERE GestionID IN (SELECT gestionId FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + ")";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /*******************************************************************
            Obtiene el número de Peticiones X Año X Mes
        ********************************************************************/
        public Int32 numeroPeticionesXrango(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /*******************************************************************
            Obtiene el número de GESTIONES Hitos
        ********************************************************************/
        public Int32 numeroGestionesHitos(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Hito=1" + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Hito=1";
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventosResumen(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_2(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();

            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }


        /*******************************************************************
            Obtiene el número de Asociaciones
        ********************************************************************/
        public Int32 numeroAsociacionesResumen(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_3(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();


            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Asociaciones] WHERE Estatus=1 AND AsociacionID != 1 AND DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Asociaciones] WHERE Estatus=1 AND AsociacionID != 1 AND DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventos(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Visitas
        ********************************************************************/
        public Int32 numeroVisitas(int LegislaturaId)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Visitas] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene el número de Ciudadanos
        ********************************************************************/
        public Int32 numeroCiudadanos(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_3(anioSel, mesSel);
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();

            if (complemento != "")
            {
                stm = "SELECT Count(*) FROM [dbo].[Ciudadanos] WHERE DiputadoID = " + diputadoId + " AND " + complemento;
            }
            else
            {
                stm = "SELECT Count(*) FROM [dbo].[Ciudadanos] WHERE DiputadoID = " + diputadoId;
            }
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count;
        }

        /*******************************************************************
            Obtiene Resumen de Peticiones X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusGestiones> resumenXestatus(int LegislaturaId, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes(anioSel, mesSel);
            List<ObjetoEstatusGestiones> ListaObjetos = new List<ObjetoEstatusGestiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();


            if (complemento != "")
            {
                stm = "SELECT EG.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EG.EstatusGestionID " + " AND " + complemento + ") " +
                        " FROM EstatusGestion AS EG";
            }
            else
            {
                stm = "SELECT EG.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[gestiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EG.EstatusGestionID)" +
                        " FROM EstatusGestion AS EG";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusGestiones obj = new ObjetoEstatusGestiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Gestiones X Clasificicación
        ********************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatusGestion> resumenXclasificacionGestion(int LegislaturaId, int anioSel, int mesSel)
        {
            List<ObjetoClasificacionEstatusGestion> ListaObjetos = new List<ObjetoClasificacionEstatusGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenGestionXcategoriaXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;
            //cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatusGestion obj = new ObjetoClasificacionEstatusGestion();
                    obj.Clasificacion = query.GetString(1);
                    obj.SinEstatus = query.GetInt32(2);
                    obj.IngresaDependencia = query.GetInt32(3);
                    obj.CopiaCiudadano = query.GetInt32(4);
                    obj.GestionRespuesta = query.GetInt32(5);
                    obj.RespuestaPositiva = query.GetInt32(6);
                    obj.RespuestaNegativa = query.GetInt32(7);
                    obj.EnProceso = query.GetInt32(8);
                    obj.Cancelada = query.GetInt32(9);
                    obj.Reasignada = query.GetInt32(10);
                    obj.Total = query.GetInt32(2) + query.GetInt32(3) + query.GetInt32(4) + query.GetInt32(5) + query.GetInt32(6) + query.GetInt32(7) + query.GetInt32(8) + query.GetInt32(9) + query.GetInt32(10);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /*******************************************************************
            Obtiene Resumen de Gestiones X Clasificicación X Subclasificacion
        ********************************************************************/
        [HttpGet]
        public List<ObjetoClasificacionEstatusGestion> resumenXclasificacionXSubclasificacion_Gestion(int LegislaturaId, int anioSel, int mesSel)
        {
            List<ObjetoClasificacionEstatusGestion> ListaObjetos = new List<ObjetoClasificacionEstatusGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenGestionXcategoriaXSubcategoriaXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;
            //cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoClasificacionEstatusGestion obj = new ObjetoClasificacionEstatusGestion();
                    obj.Clasificacion = query.GetString(1);
                    obj.Subclasificacion = query.GetString(3);
                    obj.Dependencia = query.GetString(4);
                    obj.SinEstatus = query.GetInt32(5);
                    obj.IngresaDependencia = query.GetInt32(6);
                    obj.CopiaCiudadano = query.GetInt32(7);
                    obj.GestionRespuesta = query.GetInt32(8);
                    obj.RespuestaPositiva = query.GetInt32(9);
                    obj.RespuestaNegativa = query.GetInt32(10);
                    obj.EnProceso = query.GetInt32(11);
                    obj.Cancelada = query.GetInt32(12);
                    obj.Reasignada = query.GetInt32(13);

                    obj.Total = query.GetInt32(5) + query.GetInt32(6) + query.GetInt32(7) + query.GetInt32(8) + query.GetInt32(9) + query.GetInt32(10) + query.GetInt32(11) + query.GetInt32(12) + query.GetInt32(13);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /*******************************************************************
            Obtiene Resumen de Eventos X estatus
        ********************************************************************/
        public IEnumerable<ObjetoEstatusGestiones> resumenXeventos(int LegislaturaId)
        {
            int diputadoId = 8;
            List<ObjetoEstatusGestiones> ListaObjetos = new List<ObjetoEstatusGestiones>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            //SqlCommand cmd = conn.CreateCommand();

            conn.Open();

            string stm = "SELECT EP.Nombre, " +
                        "(SELECT Count(*) FROM [dbo].[peticiones] WHERE LegislaturaID = " + LegislaturaId + " AND DiputadoID = " + diputadoId + " AND Estatus = EP.EstatusPeticionesID)" +
                        " FROM EstatusPeticiones AS EP";

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEstatusGestiones obj = new ObjetoEstatusGestiones();
                    obj.estatus = query.GetString(0);
                    obj.cantidad = query.GetInt32(1);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }



        /*******************************************************************
                GESTIONES Obtiene Costo X Categoría
        ********************************************************************/
        public IEnumerable<ObjetoCostoGestion> ObtenCostoGestionXCategoria(int LegislaturaID, int anioSel, int mesSel)
        {
            int diputadoId = 8;
            string stm = "";
            var complemento = "";
            complemento = createWhereAnioMes_4(anioSel, mesSel);
            List<ObjetoCostoGestion> ListaObjetos = new List<ObjetoCostoGestion>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();

            conn.Open();

            if (complemento != "")
            {

                stm = "SELECT ISNULL(C.CategoriaID, 0) AS CategoriaID, ISNULL(C.Descripcion, '') AS Categoria, ISNULL(SUM(P.Costo),0) AS Costo";
                stm += "  FROM Gestiones AS P ";
                stm += "  LEFT JOIN GestionCategoria AS PC ON PC.GestionID = P.GestionID ";
                stm += "  LEFT JOIN Categorias AS C ON C.CategoriaID = PC.CategoriaID ";
                stm += "  WHERE P.LegislaturaID = " + LegislaturaID + " AND P.DiputadoID = " + diputadoId + " AND " + complemento;
                stm += "  GROUP BY C.CategoriaID, C.Descripcion ";
            }
            else
            {
                stm = "SELECT ISNULL(C.CategoriaID, 0) AS CategoriaID, ISNULL(C.Descripcion, '') AS Categoria, ISNULL(SUM(P.Costo),0) AS Costo";
                stm += "  FROM Gestiones AS P ";
                stm += "  LEFT JOIN GestionCategoria AS PC ON PC.GestionID = P.GestionID ";
                stm += "  LEFT JOIN Categorias AS C ON C.CategoriaID = PC.CategoriaID ";
                stm += "  WHERE P.LegislaturaID = " + LegislaturaID + " AND P.DiputadoID = " + diputadoId;
                stm += "  GROUP BY C.CategoriaID, C.Descripcion ";
            }

            SqlCommand cmd_p = new SqlCommand(stm, conn);

            SqlDataReader query = cmd_p.ExecuteReader();
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoCostoGestion obj = new ObjetoCostoGestion();
                    obj.CategoriaId = (int)query.GetInt32(0);
                    obj.Categoria = query.GetString(1);
                    obj.Costo = query.GetDouble(2).ToString();
                    ListaObjetos.Add(obj);
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /************************************************************
            Busca si existe un Número de Folio
        *************************************************************/
        public int BuscaNumeroFolio(string folio, int legislaturaId)
        {
            var TotalRegistrosEncontrados = _context.Gestiones.Where(p => p.Folio == folio && p.LegislaturaId == legislaturaId).Count();
            return TotalRegistrosEncontrados;
        }

        /***********************************************************************************************
         *  Carga los valores del Combo de Subcategoria, dependiendo de la Categoría seleccionada
         ***********************************************************************************************/
        public JsonResult CargaValoresSubCategoria(int clasificacionId)
        {
            List<SelectListItem> resultado;

            resultado = _context.Subcategorias.Where(sc => sc.CategoriaId == clasificacionId).Select(sc => new SelectListItem
            {
                Value = sc.SubcategoriasId.ToString(),
                Text = sc.Descripcion
            }).ToList();
            resultado.Insert(0, new SelectListItem() { Value = "0", Text = "TODO" });
            return Json(resultado);
        }


        /******************************************************************************
         * Lee datos en una Tabla, para guardarlos en EXCEL
         ******************************************************************************/

        public DataTable ObtieneDatosReporteExcelList_DT()
        {
            int LegislaturaId = 2;
            int DiputaoId = 8;
            DataTable dt = new DataTable();
            dt.TableName = "Gestiones";

            dt.Columns.Add("Legislatura", typeof(string));
            dt.Columns.Add("Folio", typeof(string));
            dt.Columns.Add("Fecha Solicitud", typeof(DateTime));
            dt.Columns.Add("Paterno", typeof(string));
            dt.Columns.Add("Materno", typeof(string));
            dt.Columns.Add("Nombre", typeof(string));
            dt.Columns.Add("Descripción", typeof(string));
            dt.Columns.Add("Clasificación", typeof(string));
            dt.Columns.Add("Subclasificación", typeof(string));
            //dt.Columns.Add("Costo", typeof(string));
            dt.Columns.Add("Costo", typeof(decimal));
            dt.Columns.Add("Estatus", typeof(string));

            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpGestiones_Excel";
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
                        query.GetString(1),         // Folio Petición
                        query.GetDateTime(2),       // Fecha Solicitud
                        query.GetString(3),         // Paterno
                        query.GetString(4),         // Materno
                        query.GetString(5),         // Nombre
                        query.GetString(6),         // Descripción
                        query.GetString(7),         // Clasificación
                        query.GetString(8),         // Subclasificación
                        //query.GetDouble(9).ToString(),                            //query.GetString(8),          // Costo
                        query.GetDecimal(9),          // Costo
                        query.GetString(10)          // Estatus
                    );
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return dt;
        }


        /***********************************************************************
         *  Excel
         ***********************************************************************/
        public ActionResult WriteDataToExcel()
        {
            DataTable dt = this.ObtieneDatosReporteExcelList_DT();
            string fileName = "Gestiones.xlsx";
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
            Obtiene Avance X Semana
        ********************************************************************/
        public List<ObjetoAvanceXsemana> SolicitudesAvanceXsemana(int LegislaturaId, int DiputadoId, int ResponsableId)
        {

            List<ObjetoAvanceXsemana> ListaObjetos = new List<ObjetoAvanceXsemana>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpCOMPORTAMIENTO";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@DiputadoId", System.Data.SqlDbType.Int).Value = DiputadoId;
            cmd.Parameters.Add("@ResponsableId", System.Data.SqlDbType.Int).Value = ResponsableId;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoAvanceXsemana obj = new ObjetoAvanceXsemana();
                    obj.Anio = query.GetInt32(0);
                    obj.Mes = query.GetString(1);
                    obj.NumeroSemana = query.GetInt32(2);
                    obj.RegistradaEnSemana = query.GetInt32(3);
                    obj.ConcluidaEnSemana = query.GetInt32(4);
                    obj.ProcesoAcumuladas = query.GetInt32(5);
                    obj.ConcluidasAcumulada = query.GetInt32(6);
                    obj.Total = query.GetInt32(7);
                    obj.FechaInicioSemana = query.GetDateTime(8);
                    obj.FechaFinSemana = query.GetDateTime(9);

                    obj.RegistradaEnSemana_G = query.GetInt32(10);
                    obj.ConcluidaEnSemana_G = query.GetInt32(11);
                    obj.ProcesoAcumuladas_G = query.GetInt32(12);
                    obj.ConcluidasAcumulada_G = query.GetInt32(13);
                    obj.Total_G = query.GetInt32(14);

                    obj.EstaSemana = query.GetInt32(15);

                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /********************************************************************
               O B J E T O S
         *********************************************************************/
        public partial class ObjetoCategoriaSubCategoriaGestion
        {
            public int GestionCategoriaID { get; set; }
            public int CategoriaID { get; set; }
            public string DescripcionCat { get; set; }
            public int GestionSubcategoriaID { get; set; }
            public int SubcategoriasID { get; set; }
            public string DescripcionSubcat { get; set; }
        }

        public partial class ObjetoArchivosGestion
        {
            public int ArchivosGestionesID { get; set; }
            public int GestionID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
        }

        public partial class ObjetoBeneficiariosGestion
        {
            public int BeneficiariosID { get; set; }
            public int CiudadanoID { get; set; }
            public string NombreCompleto { get; set; }
            public string Colonia { get; set; }
            public string Calle { get; set; }
            public int GestionID { get; set; }
            public string Notas { get; set; }
            public int Estatus { get; set; }
            public string Latitud { get; set; }
            public string Longitud { get; set; }
        }
        public partial class ObjetoEstatusGestiones
        {
            public int estatusId { get; set; }
            public string estatus { get; set; }
            public int cantidad { get; set; }
        }
        public partial class ObjetoClasificacionEstatusGestion
        {
            public string Dependencia { get; set; }
            public string Clasificacion { get; set; }
            public string Subclasificacion { get; set; }
            public int SinEstatus { get; set; }
            public int IngresaDependencia { get; set; }
            public int CopiaCiudadano { get; set; }
            public int GestionRespuesta { get; set; }
            public int RespuestaPositiva { get; set; }
            public int RespuestaNegativa { get; set; }
            public int EnProceso { get; set; }
            public int Cancelada { get; set; }
            public int Reasignada { get; set; }
            public int Total { get; set; }
        }


        public partial class ObjetoGestion
        {
            public int GestionId { get; set; }
            public int? AsociacionId { get; set; }
            public string AsociacionNombre { get; set; }
            public string Folio { get; set; }
            public DateTime? FechaSolicitud { get; set; }
            public DateTime? FechaCompromiso { get; set; }
            public DateTime? FechaConclusion { get; set; }
            public string Descripcion { get; set; }
            public int? OrigenPeticionId { get; set; }
            public string OrigenPeticionNombre { get; set; }
            public int? DependeciaId { get; set; }
            public string DependenciaNombre { get; set; }
            public int? Estatus { get; set; }
            public string EstatusDescripcion { get; set; }
            public int? Hito { get; set; }
            public float? Costo { get; set; }
            public string NombreResponsable { get; set; }
            public int? SolicitanteId { get; set; }
            public string SolicitanteNombre { get; set; }
        }

        public partial class ObjetoAvanceXsemana
        {
            public int Anio { get; set; }
            public string Mes { get; set; }
            public int NumeroSemana { get; set; }
            public int RegistradaEnSemana { get; set; }
            public int ConcluidaEnSemana { get; set; }
            public int ProcesoAcumuladas { get; set; }
            public int ConcluidasAcumulada { get; set; }
            public int Total { get; set; }
            public DateTime FechaInicioSemana { get; set; }
            public DateTime FechaFinSemana { get; set; }
            public int RegistradaEnSemana_G { get; set; }
            public int ConcluidaEnSemana_G { get; set; }
            public int ProcesoAcumuladas_G { get; set; }
            public int ConcluidasAcumulada_G { get; set; }
            public int Total_G { get; set; }
            public int EstaSemana { get; set; }

        }

        public partial class ObjetoCostoGestion
        {
            public int CategoriaId { get; set; }
            public string Categoria { get; set; }
            public string Costo { get; set; }
        }
    }
}
